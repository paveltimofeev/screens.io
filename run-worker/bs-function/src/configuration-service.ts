import { IAppConfig } from './models';


export class ConfigurationService {

    static getConfig(): IAppConfig {
        return {
            vrtDataFullPath: '/tmp/vrtData'
        }
    }
}
