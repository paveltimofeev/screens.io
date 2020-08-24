import { IAppConfig, ILogger } from '../domain/models';
import { ConfigurationService } from '../app/configuration-service';

const config: IAppConfig = ConfigurationService.getAppConfig();


export class Logger implements ILogger {

    private readonly serviceName:string;

    constructor (serviceName:string) {
        this.serviceName = serviceName;
    }

    log (message:string, args?:any) {

        if (!config.enableLogging) {
            return;
        }

        if (args) {
            console.log(`[${this.serviceName}] ${message}`,
                JSON.stringify(args, null, 2));
        }
        else {
            console.log(`[${this.serviceName}] ${message}`);
        }
    };

    error (message:string, args?:any) {

        if (!config.enableLogging) {
            return;
        }

        if (args) {
            console.error(`[${this.serviceName}] ERROR: ${message}\n`,
                JSON.stringify(args, null, 2));
        }
        else {
            console.error(`[${this.serviceName}] ERROR: ${message}`);
        }
    }
}
