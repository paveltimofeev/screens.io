import { IConfig, IEngine, IEngineTestResult, ILogger } from '../domain/models';
const backstop = require('backstopjs');


export class BackstopJsWrapper implements IEngine {

    private logger: ILogger;

    constructor (logger: ILogger) {
        this.logger = logger;
    }

    async test (config: IConfig): Promise<IEngineTestResult> {

        this.logger.log('test');

        try {

            await backstop('test', { config: config } );
            this.logger.log('test completed successfully');
            return { success: true, error: null }
        }
        catch (err) {

            this.logger.error('executeTest', err.message||err);
            return { success: false, error: err }
        }
    }
}
