const {app, BrowserWindow, dialog, ipcMain, Notification, safeStorage, shell} = require('electron');
const crypto = require('crypto');
const {execFileSync} = require('child_process');
const fs = require('fs');
const os = require('os');
const path = require('path');
const initSqlJs = require('sql.js');
const {getOpenAccessStatus} = require('./open-access-policy.cjs');

let database;
let databasePath;
let documentsPath;
let persistTimer;
let mainWindow;

const gotSingleInstanceLock = app.requestSingleInstanceLock();

if (!gotSingleInstanceLock) {
  app.quit();
} else {
  app.on('second-instance', () => {
    if (!mainWindow || mainWindow.isDestroyed()) return;
    if (mainWindow.isMinimized()) mainWindow.restore();
    mainWindow.show();
    mainWindow.focus();
  });
}

function getDeviceCode() {
  let source = `${os.hostname()}|${os.userInfo().username}`;
  try {
    const output = execFileSync('reg.exe', ['query', 'HKLM\\SOFTWARE\\Microsoft\\Cryptography', '/v', 'MachineGuid'], {encoding: 'utf8'});
    source = output.match(/MachineGuid\s+REG_SZ\s+([^\r\n]+)/i)?.[1]?.trim() || source;
  } catch {
    // The hostname fallback remains stable for restricted Windows accounts.
  }
  return crypto.createHash('sha256').update(source).digest('hex').slice(0, 24).toUpperCase();
}

function validateActivationCode(code) {
  try {
    const [encodedPayload, encodedSignature] = String(code).trim().split('.');
    if (!encodedPayload || !encodedSignature) throw new Error('invalid-format');
    const publicKey = fs.readFileSync(path.join(__dirname, 'license-public.pem'));
    const validSignature = crypto.verify(
      'RSA-SHA256',
      Buffer.from(encodedPayload),
      publicKey,
      Buffer.from(encodedSignature, 'base64url'),
    );
    if (!validSignature) throw new Error('invalid-signature');
    const payload = JSON.parse(Buffer.from(encodedPayload, 'base64url').toString('utf8'));
    if (payload.device !== getDeviceCode() && payload.device !== '*') throw new Error('wrong-device');
    if (new Date(`${payload.expiresAt}T23:59:59`).getTime() < Date.now()) throw new Error('expired');
    return {status: 'active', ...payload, deviceCode: getDeviceCode()};
  } catch (error) {
    return {status: 'invalid', reason: error instanceof Error ? error.message : 'invalid', deviceCode: getDeviceCode()};
  }
}

function uniquePaths(paths) {
  return [...new Set(paths.filter(Boolean).map((item) => path.normalize(item)))];
}

function licenseFileCandidates() {
  const names = uniquePaths([
    app.getName(),
    app.name,
    'بيّنة - قضيتي',
    'bayyinah-qadiyati',
    'Bayyinah-Qadiyati',
  ]);
  const roots = uniquePaths([
    app.getPath('userData'),
    process.env.PROGRAMDATA ? path.join(process.env.PROGRAMDATA, 'Bayyinah-Qadiyati') : '',
    process.env.APPDATA ? path.join(process.env.APPDATA, 'Bayyinah-Qadiyati') : '',
    process.env.LOCALAPPDATA ? path.join(process.env.LOCALAPPDATA, 'Bayyinah-Qadiyati') : '',
    ...names.flatMap((name) => [
      process.env.APPDATA ? path.join(process.env.APPDATA, name) : '',
      process.env.LOCALAPPDATA ? path.join(process.env.LOCALAPPDATA, name) : '',
    ]),
  ]);
  return uniquePaths(roots.map((root) => path.join(root, 'license.key')));
}

function writeLicenseFile(targetPath, code) {
  try {
    fs.mkdirSync(path.dirname(targetPath), {recursive: true});
    fs.writeFileSync(targetPath, String(code).trim(), 'utf8');
    return true;
  } catch {
    return false;
  }
}

function persistActivationCode(code) {
  const targets = uniquePaths([
    path.join(app.getPath('userData'), 'license.key'),
    process.env.PROGRAMDATA ? path.join(process.env.PROGRAMDATA, 'Bayyinah-Qadiyati', 'license.key') : '',
  ]);
  return targets.map((target) => writeLicenseFile(target, code)).some(Boolean);
}

function activationDiagnosticLabel(status) {
  if (status.status === 'active') return 'صالح';
  if (status.reason === 'expired') return 'منتهي';
  if (status.reason === 'wrong-device') return 'لجهاز آخر';
  return 'غير صالح';
}

function inspectLicenseFile(candidate) {
  const result = {path: candidate, exists: fs.existsSync(candidate), status: 'غير موجود'};
  if (!result.exists) return result;
  try {
    const status = validateActivationCode(fs.readFileSync(candidate, 'utf8'));
    return {
      ...result,
      status: activationDiagnosticLabel(status),
      reason: status.reason ?? '',
      customer: status.customer ?? '',
      expiresAt: status.expiresAt ?? '',
    };
  } catch (error) {
    return {
      ...result,
      status: 'خطأ قراءة',
      reason: error instanceof Error ? error.message : 'read-error',
    };
  }
}

function readTrialStartedAtForDiagnostics() {
  if (!database) return null;
  try {
    return readScalar(`SELECT value FROM app_meta WHERE key = 'trial_started_at'`)?.value ?? null;
  } catch (error) {
    return {error: error instanceof Error ? error.message : 'read-error'};
  }
}

function buildActivationDiagnostics(context) {
  const candidates = licenseFileCandidates().map((candidate) => inspectLicenseFile(candidate));
  const fallbackDatabasePath = path.join(app.getPath('userData'), 'bayyinah.db');
  return {
    context,
    at: new Date().toISOString(),
    appName: app.getName(),
    appVersion: app.getVersion(),
    userData: app.getPath('userData'),
    deviceCode: getDeviceCode(),
    licenseCandidates: candidates,
    existingLicenseFiles: candidates.filter((candidate) => candidate.exists).map((candidate) => candidate.path),
    database: {
      path: databasePath || fallbackDatabasePath,
      exists: fs.existsSync(databasePath || fallbackDatabasePath),
      trialStartedAt: readTrialStartedAtForDiagnostics(),
    },
  };
}

function logActivationDiagnostics(context) {
  const diagnostics = buildActivationDiagnostics(context);
  const line = `[Bayyinah activation diagnostics] ${JSON.stringify(diagnostics)}`;
  console.info(line);
  try {
    const logPath = path.join(app.getPath('userData'), 'activation-diagnostics.log');
    fs.mkdirSync(path.dirname(logPath), {recursive: true});
    fs.appendFileSync(logPath, `${line}\n`, 'utf8');
  } catch (error) {
    console.warn('[Bayyinah activation diagnostics] failed to write log', error);
  }
  return diagnostics;
}
function findStoredLicenseStatus() {
  let invalidStatus = null;
  for (const candidate of licenseFileCandidates()) {
    if (!fs.existsSync(candidate)) continue;
    try {
      const code = fs.readFileSync(candidate, 'utf8');
      const status = validateActivationCode(code);
      if (status.status === 'active') {
        persistActivationCode(code);
        return {...status, licensePath: candidate};
      }
      invalidStatus = invalidStatus ?? {...status, licensePath: candidate};
    } catch (error) {
      invalidStatus = invalidStatus ?? {
        status: 'invalid',
        reason: error instanceof Error ? error.message : 'invalid',
        deviceCode: getDeviceCode(),
        licensePath: candidate,
      };
    }
  }
  return invalidStatus;
}

function getLicenseStatus() {
  return getOpenAccessStatus(getDeviceCode());
}

function persistDatabase() {
  if (!database || !databasePath) return;
  if (persistTimer) clearTimeout(persistTimer);
  persistTimer = undefined;
  fs.writeFileSync(databasePath, Buffer.from(database.export()));
}

function schedulePersist() {
  if (persistTimer) clearTimeout(persistTimer);
  persistTimer = setTimeout(persistDatabase, 150);
}

function timestampLabel() {
  return new Date().toISOString().replace(/[:.]/g, '-');
}

function createBackupAt(rootPath, prefix = 'Bayyinah-Backup') {
  persistDatabase();
  const target = path.join(rootPath, `${prefix}-${timestampLabel()}`);
  fs.mkdirSync(target, {recursive: true});
  fs.copyFileSync(databasePath, path.join(target, 'bayyinah.db'));
  if (fs.existsSync(documentsPath)) fs.cpSync(documentsPath, path.join(target, 'documents'), {recursive: true});
  fs.writeFileSync(
    path.join(target, 'backup-info.json'),
    JSON.stringify({createdAt: new Date().toISOString(), schemaVersion: 1, appVersion: app.getVersion()}, null, 2),
    'utf8',
  );
  return target;
}

function createDailyBackup() {
  const root = path.join(app.getPath('userData'), 'backups');
  fs.mkdirSync(root, {recursive: true});
  const today = new Date().toISOString().slice(0, 10);
  const last = readScalar(`SELECT value FROM app_meta WHERE key = 'last_auto_backup'`);
  if (last?.value === today) return;
  createBackupAt(root, 'Auto-Backup');
  database.run(
    `INSERT INTO app_meta(key, value, updated_at) VALUES('last_auto_backup', ?, CURRENT_TIMESTAMP)
     ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = CURRENT_TIMESTAMP`,
    [today],
  );
  const backups = fs.readdirSync(root, {withFileTypes: true})
    .filter((entry) => entry.isDirectory() && entry.name.startsWith('Auto-Backup-'))
    .sort((a, b) => b.name.localeCompare(a.name));
  for (const oldBackup of backups.slice(10)) {
    const candidate = path.resolve(root, oldBackup.name);
    if (candidate.startsWith(path.resolve(root) + path.sep)) fs.rmSync(candidate, {recursive: true, force: true});
  }
  persistDatabase();
}

function readScalar(sql, params = []) {
  const statement = database.prepare(sql);
  statement.bind(params);
  const value = statement.step() ? statement.getAsObject() : null;
  statement.free();
  return value;
}

function encodePayload(value) {
  const json = JSON.stringify(value);
  if (!safeStorage.isEncryptionAvailable()) return json;
  return `enc:v1:${safeStorage.encryptString(json).toString('base64')}`;
}

function decodePayload(value) {
  const payload = String(value ?? 'null');
  if (!payload.startsWith('enc:v1:')) return JSON.parse(payload);
  const encrypted = Buffer.from(payload.slice(7), 'base64');
  return JSON.parse(safeStorage.decryptString(encrypted));
}

async function initializeDatabase() {
  const wasmPath = app.isPackaged
    ? path.join(process.resourcesPath, 'sql-wasm.wasm')
    : require.resolve('sql.js/dist/sql-wasm.wasm');
  const SQL = await initSqlJs({locateFile: () => wasmPath});
  const userDataPath = app.getPath('userData');
  databasePath = path.join(userDataPath, 'bayyinah.db');
  documentsPath = path.join(userDataPath, 'documents');
  fs.mkdirSync(documentsPath, {recursive: true});

  database = fs.existsSync(databasePath)
    ? new SQL.Database(fs.readFileSync(databasePath))
    : new SQL.Database();

  database.run(`
    PRAGMA foreign_keys = ON;
    CREATE TABLE IF NOT EXISTS app_meta (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL,
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
    CREATE TABLE IF NOT EXISTS records (
      entity_type TEXT NOT NULL,
      record_id TEXT NOT NULL,
      payload TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (entity_type, record_id)
    );
    CREATE INDEX IF NOT EXISTS idx_records_type ON records(entity_type);
    CREATE TABLE IF NOT EXISTS attachments (
      id TEXT PRIMARY KEY,
      owner_type TEXT NOT NULL,
      owner_id TEXT NOT NULL,
      filename TEXT NOT NULL,
      file_path TEXT NOT NULL,
      mime_type TEXT,
      size INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
    CREATE INDEX IF NOT EXISTS idx_attachments_owner ON attachments(owner_type, owner_id);
    CREATE TABLE IF NOT EXISTS alert_rules (
      id TEXT PRIMARY KEY,
      owner_type TEXT NOT NULL,
      owner_id TEXT NOT NULL,
      offset_minutes INTEGER NOT NULL,
      enabled INTEGER NOT NULL DEFAULT 1,
      last_triggered_at TEXT
    );
    CREATE TABLE IF NOT EXISTS renewal_history (
      id TEXT PRIMARY KEY,
      owner_type TEXT NOT NULL,
      owner_id TEXT NOT NULL,
      previous_date TEXT,
      new_date TEXT NOT NULL,
      previous_amount REAL,
      new_amount REAL,
      notes TEXT,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
    CREATE TABLE IF NOT EXISTS audit_log (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      action TEXT NOT NULL,
      entity_type TEXT NOT NULL,
      record_id TEXT NOT NULL,
      details TEXT,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
  `);
  database.run(
    `INSERT INTO app_meta(key, value, updated_at) VALUES('schema_version', '1', CURRENT_TIMESTAMP)
     ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = CURRENT_TIMESTAMP`,
  );
  persistDatabase();
}

function registerIpcHandlers() {
  ipcMain.handle('storage:get', (_event, key) => {
    const row = readScalar(
      `SELECT payload FROM records WHERE entity_type = 'app-state' AND record_id = ?`,
      [key],
    );
    return row ? decodePayload(row.payload) : null;
  });

  ipcMain.handle('storage:set', (_event, key, value) => {
    database.run(
      `INSERT INTO records(entity_type, record_id, payload, created_at, updated_at)
       VALUES('app-state', ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
       ON CONFLICT(entity_type, record_id)
       DO UPDATE SET payload = excluded.payload, updated_at = CURRENT_TIMESTAMP`,
      [key, encodePayload(value)],
    );
    schedulePersist();
    return true;
  });

  ipcMain.handle('storage:export', () => {
    const statement = database.prepare(`SELECT record_id, payload FROM records WHERE entity_type = 'app-state'`);
    const output = {};
    while (statement.step()) {
      const row = statement.getAsObject();
      output[row.record_id] = decodePayload(row.payload);
    }
    statement.free();
    return output;
  });

  ipcMain.handle('storage:info', () => ({databasePath, documentsPath}));

  ipcMain.handle('license:status', () => getLicenseStatus());
  ipcMain.handle('license:activate', () => getOpenAccessStatus(getDeviceCode()));

  ipcMain.handle('backup:create', async () => {
    const selection = await dialog.showOpenDialog({title: 'اختر مكان حفظ النسخة الاحتياطية', properties: ['openDirectory', 'createDirectory']});
    if (selection.canceled || !selection.filePaths[0]) return null;
    return createBackupAt(selection.filePaths[0]);
  });

  ipcMain.handle('backup:restore', async () => {
    const selection = await dialog.showOpenDialog({title: 'اختر مجلد النسخة الاحتياطية', properties: ['openDirectory']});
    if (selection.canceled || !selection.filePaths[0]) return false;
    const sourceRoot = path.resolve(selection.filePaths[0]);
    const sourceDatabase = path.join(sourceRoot, 'bayyinah.db');
    if (!fs.existsSync(sourceDatabase)) throw new Error('لا يحتوي المجلد على قاعدة بيانات بيّنة.');
    createBackupAt(path.join(app.getPath('userData'), 'backups'), 'Before-Restore');
    database.close();
    fs.copyFileSync(sourceDatabase, databasePath);
    const sourceDocuments = path.join(sourceRoot, 'documents');
    if (fs.existsSync(sourceDocuments)) fs.cpSync(sourceDocuments, documentsPath, {recursive: true, force: true});
    app.relaunch();
    app.exit(0);
    return true;
  });

  ipcMain.handle('files:save-data-url', (_event, {id, ownerType, ownerId, filename, dataUrl, mimeType}) => {
    const safeName = String(filename).replace(/[<>:"/\\|?*\x00-\x1F]/g, '_');
    const ownerFolder = path.join(documentsPath, String(ownerType), String(ownerId));
    fs.mkdirSync(ownerFolder, {recursive: true});
    const targetPath = path.join(ownerFolder, `${id}-${safeName}`);
    const encoded = String(dataUrl).split(',')[1] ?? '';
    const buffer = Buffer.from(encoded, 'base64');
    fs.writeFileSync(targetPath, buffer);
    database.run(
      `INSERT OR REPLACE INTO attachments(id, owner_type, owner_id, filename, file_path, mime_type, size)
       VALUES(?, ?, ?, ?, ?, ?, ?)`,
      [id, ownerType, ownerId, safeName, targetPath, mimeType ?? '', buffer.length],
    );
    schedulePersist();
    return {path: targetPath, size: buffer.length};
  });

  ipcMain.handle('files:open', async (_event, filePath) => shell.openPath(filePath));

  ipcMain.handle('desktop:notify', (_event, {title, body}) => {
    if (!Notification.isSupported()) return false;
    new Notification({title, body}).show();
    return true;
  });

  ipcMain.handle('reports:save-pdf', async (_event, {html, filename}) => {
    const selection = await dialog.showSaveDialog({
      title: 'حفظ التقرير بصيغة PDF',
      defaultPath: path.join(app.getPath('documents'), filename || 'Bayyinah-Report.pdf'),
      filters: [{name: 'PDF', extensions: ['pdf']}],
    });
    if (selection.canceled || !selection.filePath) return null;
    const reportWindow = new BrowserWindow({show: false, webPreferences: {sandbox: true}});
    await reportWindow.loadURL(`data:text/html;charset=utf-8,${encodeURIComponent(html)}`);
    const pdf = await reportWindow.webContents.printToPDF({printBackground: true, pageSize: 'A4'});
    fs.writeFileSync(selection.filePath, pdf);
    reportWindow.destroy();
    return selection.filePath;
  });
}

function createWindow() {
  const window = new BrowserWindow({
    width: 1440,
    height: 900,
    minWidth: 1100,
    minHeight: 720,
    show: false,
    backgroundColor: '#f5f7fa',
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false,
    },
  });
  mainWindow = window;

  let shown = false;
  const revealWindow = () => {
    if (shown || window.isDestroyed()) return;
    shown = true;
    window.show();
    window.focus();
  };

  window.once('ready-to-show', revealWindow);
  window.webContents.once('did-finish-load', revealWindow);
  window.webContents.once('did-fail-load', revealWindow);
  setTimeout(revealWindow, 4000);
  window.on('closed', () => {
    if (mainWindow === window) mainWindow = undefined;
  });
  window.webContents.setWindowOpenHandler(({url}) => {
    void shell.openExternal(url);
    return {action: 'deny'};
  });

  if (process.env.VITE_DEV_SERVER_URL) {
    void window.loadURL(process.env.VITE_DEV_SERVER_URL);
  } else {
    void window.loadFile(path.join(__dirname, '..', 'dist', 'index.html'));
  }
}

if (gotSingleInstanceLock) {
  app.whenReady().then(async () => {
    await initializeDatabase();
    createDailyBackup();
    registerIpcHandlers();
    if (process.env.BAYYINAH_HEADLESS_TEST === '1') {
      console.log(JSON.stringify({databasePath, documentsPath, schemaVersion: 1}));
      app.quit();
      return;
    }
    createWindow();
    app.on('activate', () => {
      if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
  });
}

app.on('before-quit', persistDatabase);
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
