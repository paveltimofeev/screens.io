let configuration;

console.log('[Configuration] SCREENS_ENV:', process.env.SCREENS_ENV);

if (process.env.SCREENS_ENV === 'LOCAL') {
  console.log('[Configuration] config-local.json will used');
  configuration = require('../../../config-local')
}
else {
  console.log('[Configuration] config.json will used because SCREENS_ENV !== LOCAL');
  configuration = require('../../../config')
}

const BACKEND_CONFIG = process.env.BACKEND_CONFIG;
if (BACKEND_CONFIG) {

  console.log('[Configuration] BACKEND_CONFIG env var found. Config will parsed from PROXY_CONFIG.');

  try {
    configuration = JSON.parse(BACKEND_CONFIG);
  }
  catch (err) {
    console.error(
      '[Configuration] BACKEND_CONFIG parse failed. It should be stringified JSON',
      err)
  }
}

module.exports = configuration;
