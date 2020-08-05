import { IAppConfig } from './models';


export class ConfigurationService {

    static getAppConfig(): IAppConfig {

        return {
            enableLogging: true,
            vrtDataFullPath: 'c:\\tmp\\vrtData',
            bucketName: 'vrtdata',
            outgoingQueueUrl: 'https://sqs.us-east-1.amazonaws.com/772145494782/vrt_results',
            resizeConfig: {
                fit: 'cover',
                position: 'right top',
                withoutEnlargement: true
            },
            resizeOpts: {
                sm: { quality: 80, width: 185, height: 150 },
                md: { quality: 90, width: 420, height: 300 },
                lg: { quality: 90, width: 570 }
            }
        }
    }
}
