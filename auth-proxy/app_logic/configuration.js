let configuration;

console.log('[Configuration] SCREENS_ENV:', process.env.SCREENS_ENV);

if (process.env.SCREENS_ENV === 'LOCAL') {
  console.log('[Configuration] config-local.json will used');
  configuration = require('../config-local')
}
else {
  console.log('[Configuration] config.json will used because SCREENS_ENV !== LOCAL');
  configuration = require('../config')
}

const PROXY_CONFIG = process.env.PROXY_CONFIG;
if (PROXY_CONFIG) {

  console.log('[Configuration] PROXY_CONFIG env var found. Config will parsed from PROXY_CONFIG.');

  try {
    configuration = JSON.parse(PROXY_CONFIG);
  }
  catch (err) {
    console.error(
      '[Configuration] PROXY_CONFIG parse failed. It should be stringified JSON',
      err)
  }
}

console.log('[Configuration] Cookies settings', configuration ? configuration.cookies || 'n/a' : 'n/a');

module.exports = configuration;
