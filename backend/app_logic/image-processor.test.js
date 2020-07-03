const ip = require('./image-processor');

(async () => {

  const resizeReference = await ip.resizeReference('c:\\Temp\\img\\big.png', ['sm, md']);
  console.log('resizeReference', resizeReference)


  const resizeTestResult = await ip.resizeTestResult('c:\\Temp\\img\\big_diff.png', ['sm, md']);
  console.log('resizeTestResult', resizeTestResult)
})();
