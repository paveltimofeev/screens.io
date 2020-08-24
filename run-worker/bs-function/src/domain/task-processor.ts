import { IIncomingQueueMessage, IEngine, IJsonReport, IConfig, ILogger, IAppConfig } from "./models";


export interface IInputReader {
    getTask(): Task;
}
export class Task {

    handler: string;
    message: IIncomingQueueMessage;
}
export interface IQueueService {
    sendMessage(queueUri:string, messageBody:string): Promise<boolean>;
    deleteMessage(queueUri:string, messageHandler:string): Promise<boolean>;
}
export interface IStorageService {
    get(fileUris:string[], targetFolder:string): Promise<string[]>;
    save(files:string[], fromFolder: string): Promise<boolean>;
}
export interface IReportReader {
    read(folder:string): Promise<Report>
}
export class Report {
    jsonReport: IJsonReport;
    resultFiles: string[];
}


export class TaskProcessor {

    constructor (
        private readonly _storage: IStorageService,
        private readonly _engine: IEngine,
        private readonly _reportReader: IReportReader,
        private readonly _queue: IQueueService,
        private readonly _appConfig: IAppConfig,
        private readonly _logger: ILogger,
    ) {}

    async run (task: Task): Promise<boolean> {

        const config: IConfig = task.message.config;
        const references = config.scenarios
                    .map(x => x.meta_referenceImageUrl)
                    .filter(Boolean);

        const downloadedRefs = await this._storage.get(
            references,
            config.paths.bitmaps_reference
        );

        const tested = await this._engine.test( config );

        if (!tested.success) {
            this._logger.log('Test execution failed. That\'s Ok');
        }

        const report = await this._reportReader.read( config.paths.json_report );
        const uploaded = await this._storage.save(
            report.resultFiles,
            config.paths.bitmaps_test
        );

        if (!uploaded) {
            this._logger.error('Cannot upload result screenshots and difference images');
            return false;
        }

        const sent = await this._queue.sendMessage(
            this._appConfig.outgoingQueue.queueUrl,
            JSON.stringify(report.jsonReport)
        );

        if (!sent) {
            this._logger.error('Cannot send report to', this._appConfig.outgoingQueue.queueUrl);
            return false;
        }

        const deleted = await this._queue.deleteMessage(
            this._appConfig.incomingQueue.queueUrl,
            task.handler
        );

        if (!deleted) {
            this._logger.error('Cannot delete task message at', this._appConfig.incomingQueue.queueUrl);
            return false;
        }

        this._logger.log('SUCCESS: Task completed.');
        return true;
    }
}


/// RUNNER
/*

const input: IInputReader = undefined;
const processor = new TaskProcessor(
    undefined,
    undefined,
    undefined,
    undefined);

processor.run(input.getTask());

*/
