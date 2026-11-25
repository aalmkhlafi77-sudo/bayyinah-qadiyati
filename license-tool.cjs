const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const projectRoot = __dirname;
const privateKeyPath = path.join(projectRoot, 'license-private.pem');
const publicKeyPath = path.join(projectRoot, 'electron', 'license-public.pem');

function readArgument(name, fallback = '') {
  const index = process.argv.indexOf(`--${name}`);
  return index >= 0 ? process.argv[index + 1] ?? fallback : fallback;
}

if (process.argv.includes('--init')) {
  if (fs.existsSync(privateKeyPath) || fs.existsSync(publicKeyPath)) {
    console.log('License keys already exist.');
    process.exit(0);
  }
  const {privateKey, publicKey} = crypto.generateKeyPairSync('rsa', {
    modulusLength: 3072,
    publicKeyEncoding: {type: 'spki', format: 'pem'},
    privateKeyEncoding: {type: 'pkcs8', format: 'pem'},
  });
  fs.writeFileSync(privateKeyPath, privateKey, {mode: 0o600});
  fs.writeFileSync(publicKeyPath, publicKey);
  console.log(`Private key: ${privateKeyPath}`);
  console.log(`Public key: ${publicKeyPath}`);
  process.exit(0);
}

if (!fs.existsSync(privateKeyPath)) {
  console.error('Run: node license-tool.cjs --init');
  process.exit(1);
}

const customer = readArgument('customer');
const device = readArgument('device');
const expiresAt = readArgument('expires');
const maxUsers = Number(readArgument('users', '5'));
if (!customer || !device || !expiresAt) {
  console.error('Usage: node license-tool.cjs --customer "Name" --device DEVICE_CODE --expires 2027-12-31 --users 5');
  process.exit(1);
}

const payload = {
  licenseId: crypto.randomUUID(),
  customer,
  device,
  expiresAt,
  maxUsers,
  issuedAt: new Date().toISOString(),
  features: ['cases', 'sessions', 'agencies', 'monitoring', 'reports', 'backup'],
};
const encodedPayload = Buffer.from(JSON.stringify(payload)).toString('base64url');
const signature = crypto.sign('RSA-SHA256', Buffer.from(encodedPayload), fs.readFileSync(privateKeyPath)).toString('base64url');
const activationCode = `${encodedPayload}.${signature}`;
const outputPath = path.join(projectRoot, `license-${payload.licenseId}.txt`);
fs.writeFileSync(outputPath, activationCode, 'utf8');
console.log(outputPath);

