const {app, safeStorage} = require('electron');
const fs = require('fs');
const initSqlJs = require('sql.js');

async function main() {
  await app.whenReady();
  const dbPath = process.env.DB_PATH;
  if (!dbPath) throw new Error('DB_PATH is required');
  const SQL = await initSqlJs({locateFile: () => require.resolve('sql.js/dist/sql-wasm.wasm')});
  const db = new SQL.Database(fs.readFileSync(dbPath));
  const result = db.exec("SELECT record_id, payload FROM records WHERE entity_type = 'app-state' ORDER BY record_id");
  const rows = result[0]?.values ?? [];
  const output = [];
  for (const [key, payload] of rows) {
    const text = String(payload);
    const item = {key, encrypted: text.startsWith('enc:v1:'), ok: false, error: '', preview: ''};
    try {
      const json = item.encrypted
        ? safeStorage.decryptString(Buffer.from(text.slice(7), 'base64'))
        : text;
      item.ok = true;
      item.preview = json.slice(0, 120);
    } catch (error) {
      item.error = error instanceof Error ? error.message : String(error);
    }
    output.push(item);
  }
  console.log(JSON.stringify({encryptionAvailable: safeStorage.isEncryptionAvailable(), output}, null, 2));
  app.quit();
}

main().catch((error) => {
  console.error(error);
  app.quit();
  process.exit(1);
});
