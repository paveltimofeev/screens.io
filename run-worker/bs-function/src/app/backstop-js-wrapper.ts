import { IConfig, IEngine, IEngineTestResult } from '../domain/models';
import { Logger } from '../infrastructure/utils';
const backstop = require('backstopjs');

const logger = new Logger('BackstopJsWrapper');

export class BackstopJsWrapper implements IEngine {

    async test (config: IConfig): Promise<IEngineTestResult> {

        logger.log('test');

        try {

            await backstop('test', { config: config } );
            return { success: true, error: null }
        }
        catch (err) {

            logger.error('executeTest', err.message||err);
            return { success: false, error: err }
        }
    }
}
