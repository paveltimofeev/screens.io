
function uuidv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

function uniqueOnly (value, index, self) {
  return self.findIndex(x => {
    return x.label === value.label && x.status === value.status
  }) === index;
}

const validateScenario = (data) => {

  const allowStringArraysOnly = (scenario, prop) => {
    if(
      !Array.isArray( scenario[ prop ] ) ||
      scenario[ prop ] == null ||
      (typeof (scenario[ prop ]) === 'string' && scenario[ prop ].trim() === '') )
    {
      scenario[ prop ] = []
    }

    scenario[ prop ] = scenario[ prop ].filter( x => typeof (x) === 'string' && x.trim() !== '' && x !== '' )
  };

  allowStringArraysOnly(data, 'hideSelectors');
  allowStringArraysOnly(data, 'removeSelectors');
  allowStringArraysOnly(data, 'clickSelectors');
  allowStringArraysOnly(data, 'hoverSelectors');
  allowStringArraysOnly(data, 'selectors');
}

function skipPassedIfHasFailed (value, index, self) {
  let found = self.findIndex(x => {
    return x.label === value.label && x.status === 'Failed'
  })
  return  found  === index || found === -1;
}


module.exports = {

  uuidv4: uuidv4,
  uniqueOnly: uniqueOnly,
  validateScenario: validateScenario,
  skipPassedIfHasFailed: skipPassedIfHasFailed,
};
