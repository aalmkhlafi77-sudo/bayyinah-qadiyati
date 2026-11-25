function getOpenAccessStatus(deviceCode) {
  return {
    status: 'active',
    customer: 'نسخة مفتوحة',
    deviceCode,
    maxUsers: 1_000_000,
  };
}

module.exports = {getOpenAccessStatus};
