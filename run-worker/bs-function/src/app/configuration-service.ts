import { IAppConfig } from '../domain/models';


export class ConfigurationService {

    static getAppConfig(): IAppConfig {

        return {
            enableLogging: true,
            vrtDataFullPath: 'c:\\tmp\\vrtData',
            bucketName: 'vrtdata',
            incomingQueue: {
                queueUrl: 'https://sqs.us-east-1.amazonaws.com/772145494782/vrt_task',
                pollingInterval: 2000,
                maxNumberOfMessages: 10,
                visibilityTimeout: 60,
                waitTimeSeconds: 0,
            },
            outgoingQueue: {
                queueUrl: 'https://sqs.us-east-1.amazonaws.com/772145494782/vrt_results'
            },
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
