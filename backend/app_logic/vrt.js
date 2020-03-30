var backstop = require('backstopjs');
var fs = require('fs');
var path = require('path');

class VRT {

    constructor(tenantId, userId, customConfig) {
        
        this._tenantId = tenantId;
        this._userId = userId;
        this._customConfig = customConfig;
        this._history = [];
    }

    getReport (config) {
    
        var config = this.getConfig();

        var report = JSON.parse(
                fs.readFileSync(
                    path.join(config.paths.json_report, 'jsonReport.json'), 
                    'utf8'
                ));

        report.tests.forEach(t => {
            t.pair.reference = path.join( config.paths.html_report, t.pair.reference)
            t.pair.test = path.join( config.paths.html_report, t.pair.test)
        });

        return report;
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

    run (opts) {

        var config = this.getConfig();
        
        if (opts.url) {
            config.scenarios.forEach( s => { s.url = opts.url } );
        }

        backstop('test', { config: config} )
            .then( ()  => { this.writeHistory(config, 'success'); })
            .catch((e) => { this.writeHistory(config, 'failed', e); });
    }

    approve () {
                
        var config = this.getConfig();
        
        backstop('approve', { config: config} )
            .then( (r) => { console.log('[VRT] approve done', r) })
            .catch( (e) => { console.log('[VRT] approve failed', e)});
    }

    writeHistory (config, status, data) {

        this._history.push(
            {
                status,
                data, 
                report: this.getReport( config )
            });
    }

    history () {

        fs.readdir('vrt_data\\test-tenant\\test-user\\bitmaps_test', (err, files) => {
            console.log('[VRT] history', err);
            console.log('[VRT] history', files);
        })

        return this._history;
    }
}

module.exports = new VRT('test-tenant', 'test-user', {});
