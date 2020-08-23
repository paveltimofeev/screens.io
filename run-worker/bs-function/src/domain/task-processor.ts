import { IIncomingQueueMessage, IEngine, IJsonReport, IConfig } from "./models";


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
    save(files:string[]): Promise<boolean>;
}
export interface IReportReader {
    read(path:string): Promise<Report>
}
export class Report {
    jsonReport: IJsonReport;
    resultFiles: string[];
}


const INCOMING_QUEUE_URI = '';
const OUTGOING_QUEUE_URI = '';


export class TaskProcessor {

    constructor (
        private readonly _storage: IStorageService,
        private readonly _engine: IEngine,
        private readonly _reportReader: IReportReader,
        private readonly _queue: IQueueService
    ) {}

    log (msg:string) {
        console.log('[TaskProcessor]', msg)
    }

    async run (task: Task) {

        const config: IConfig = task.message.config;
        const references = config.scenarios
                    .map(x => x.meta_referenceImageUrl)
                    .filter(Boolean)

        const downloaded = await this._storage.get(
            references,
            config.paths.bitmaps_reference
            );

        if (!downloaded) {
            this.log('ERROR: Cannot download screenshot references');
            return;
        }

        const tested = await this._engine.test( config );
        
        if (!tested.success) {
            this.log('ERROR: Test execution failed');
            return;
        }

        const report = await this._reportReader.read( config.paths.json_report );
        const uploaded = await this._storage.save(report.resultFiles);
        
        if (!uploaded) {
            this.log('ERROR: Cannot upload result screenshots and difference images');
            return;
        }

        const sent = await this._queue.sendMessage(OUTGOING_QUEUE_URI, JSON.stringify(report.jsonReport));
        
        if (!sent) {
            this.log('ERROR: Cannot send report');
            return;
        }

        const deleted = await this._queue.deleteMessage(INCOMING_QUEUE_URI, task.handler);

        if (!deleted) {
            this.log('ERROR: Cannot delete task message');
            return;
        }
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