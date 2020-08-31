const appUtils = require('../infrastructure/app-utils');


class QueueWatcher {

  constructor (queueAdapter) {
    this._queue = queueAdapter;
  }

  async _pollFunc (callback) {

    const m = await this._queue.receive();

    if (m.Messages && m.Messages.length > 0) {

      const messages = m.Messages.map( x => ({
        handle : x.ReceiptHandle,
        body : appUtils.safeParse( x.Body )
      }));

      for ( let i = 0; i < messages.length; i++ ) {

        callback( messages[ i ].body );
        await this._queue.delete( messages[ i ].handle )
      }
    }
  }

  watch (pollInterval, callback) {

    if (this._watched) {
      console.log('ERROR: Already watched');
      return false;
    }

    this._watched = true;

    this._intervalHandler = setInterval(
      async () => { await this._pollFunc(callback); },
      pollInterval
    );
  }

  stop () {

    if (!this._watched) {
      console.log('ERROR: Not watched');
      return false;
    }

    clearInterval(this._intervalHandler);
    this._watched = false;
  }
}

module.exports = {
  QueueWatcher: QueueWatcher
};
