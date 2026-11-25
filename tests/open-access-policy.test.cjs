const test = require('node:test');
const assert = require('node:assert/strict');

const {getOpenAccessStatus} = require('../electron/open-access-policy.cjs');

test('returns unrestricted active access without a trial period', () => {
  const status = getOpenAccessStatus('DEVICE-TEST');

  assert.equal(status.status, 'active');
  assert.equal(status.customer, 'نسخة مفتوحة');
  assert.equal(status.deviceCode, 'DEVICE-TEST');
  assert.ok(status.maxUsers >= 1_000_000);
  assert.equal('trialEndsAt' in status, false);
});
