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


export const throwIfInvalidPathPart = (name:string, pathPart:any) => {

    if (
        !pathPart ||
        typeof(pathPart) !== 'string' ||
        pathPart.length === 0 ||
        pathPart === ''
    ) {
        throw new Error( `Invalid path part: "${name}" = "${pathPart}"`)
    }
};


export const validateArray = (name:string, param:any) => {

    if (!param || param.length === 0) {
        throw new Error(`No "${name}" found. param=${ param }`)
    }
};


export const safeParse = <T>(strData:string, defValue:T) => {

    try {
        return JSON.parse(strData) as T;
    }
    catch (err) {
        console.error('[safeParse] ERROR', err);
        return defValue;
    }
};
