var backstop = require('backstopjs');
var fs = require('fs');
var path = require('path');

function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

class VRT {

    constructor(tenantId, userId, customConfig) {

        this._tenantId = tenantId;
        this._userId = userId;
        this._customConfig = customConfig;
        this._history = [];
        this.refreshConfig();
    }

    refreshConfig () {

        this._config = this.getConfig();
    }

    getReport (jobId, cb) {

        fs.readFile(
          path.join(this._config.paths.bitmaps_test, jobId, 'report.json'),
          'utf8',
          (err, file) => {

              var report = JSON.parse( file )

              report.tests.forEach( t => {

                  t.pair.reference = '\\' + path.join( this._config.paths.html_report, t.pair.reference )
                  t.pair.test = '\\' + path.join( this._config.paths.html_report, t.pair.test )

                  if (t.pair.diffImage) {
                      t.pair.diffImage = '\\' + path.join( this._config.paths.html_report, t.pair.diffImage )
                  }
              })

              cb( err, report )
          })
    }

    getBasicConfig (cb) {

      fs.readFile(
        `vrt_data/${this._tenantId}/vrtconfig.json`,
        'utf8', (error, file) => {
            cb(error, JSON.parse(file))
        })
    }

    setBasicConfig (updData, cb) {

        this.getBasicConfig( (err, config) => {

            var data = { ...config, ...updData }

            fs.writeFile(
              `vrt_data/${this._tenantId}/vrtconfig.json`,
              JSON.stringify(data),
              'utf8',
              (error) => {

                  if (!error) {
                      this.refreshConfig();
                  }

                  cb(error);
              })
        })
    }

    getConfig () {

        var config = JSON.parse(
                fs.readFileSync(`vrt_data/${this._tenantId}/vrtconfig.json`, 'utf8')
            );

        var result = {...config, ...this._customConfig}

        result.paths = {

            bitmaps_reference: `vrt_data/${this._tenantId}/bitmaps_reference`,
            engine_scripts: `vrt_data/${this._tenantId}/engine_scripts`,

            bitmaps_test: `vrt_data/${this._tenantId}/${this._userId}/bitmaps_test`,
            html_report: `vrt_data/${this._tenantId}/${this._userId}/html_report`,
            ci_report: `vrt_data/${this._tenantId}/${this._userId}/ci_report`,
            json_report: `vrt_data/${this._tenantId}/${this._userId}/json_report`
          };

        return result;
    }

    getHistory (cb) {

        fs.readdir( this._config.paths.bitmaps_test, cb )
    }

    run (opts, cb) {

        var uid = uuidv4()

        var configCopy = JSON.parse(JSON.stringify(this._config));

        if (opts.url) {
            configCopy.scenarios.forEach( s => { s.url = opts.url } );
        }

        backstop('test', { config: configCopy} )
            .then( ()  => { this.writeHistory(configCopy, 'success'); })
            .catch((e) => { this.writeHistory(configCopy, 'failed', e); });

        cb(null, uid);
    }

    approve (cb) {

        backstop('approve', { config: this._config} )
            .then( (r) => { console.log('[VRT] approve done', r); cb(null, r); })
            .catch( (e) => { console.log('[VRT] approve failed', e); cb(e);});
    }

    writeHistory (config, status, data) {

        this._history.push(
            {
                status,
                data
            });
    }
}

module.exports = new VRT('test-tenant', 'test-user', {});
