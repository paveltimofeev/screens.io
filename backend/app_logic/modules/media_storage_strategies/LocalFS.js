
console.log('[Media Storage] Init Local FileSystem Strategy');

class LocalFSFlow {

  async RunPreProcess() {}
  async RunPostProcess() {}

  async ApprovePreProcess() {}
  async ApprovePostProcess() {}
}


const createFlow = () => {

    console.log('[Media Storage] Creating Local FileSystem Flow');
    return new LocalFSFlow()
}


module.exports = {
    createFlow: createFlow
}
