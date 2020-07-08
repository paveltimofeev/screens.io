const path = require('path')

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


class FilePathsService {

  vrtDataFolderName () {
    return 'vrt_data'
  }

  vrtDataFullPath () {
    return path.join(__dirname, '..', this.vrtDataFolderName())
  }

  relativeToVrtDataPath (fullPath) {
    return path.relative(this.vrtDataFullPath(), fullPath )
  }

  pairItemFullPath (pairItemPath) {
    return path.join(this.vrtDataFullPath(), 'html_report', pairItemPath)
  }

  reportItemFullPath (tenant, userid, runId, reportItemPath) {

    return path.join(this.vrtDataFullPath(), tenant, userid, 'json_report', runId, reportItemPath)
  }

  pairItemRelativePath (pairItemPath) {
    return path.relative(this.vrtDataFullPath(), this.pairItemFullPath(pairItemPath) )
  }
}


module.exports = {

  uuidv4: uuidv4,
  uniqueOnly: uniqueOnly,
  validateScenario: validateScenario,
  skipPassedIfHasFailed: skipPassedIfHasFailed,

  FilePathsService: FilePathsService
};
