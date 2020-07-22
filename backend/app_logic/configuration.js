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

module.exports = configuration;
