import { IConfig, IIncomingQueueMessage, IOutgoingQueueMessage, IReport, IScenario, IViewport } from './models';
import { EngineAdapter } from './engine-adapter';
import { S3Flow } from './s3-flow';
import { JsonReportAdapter } from './json-report-adapter';
import { FilePathsService } from './file-paths-service';
import { ImageProcessor } from './image-processor';
import { Logger } from './utils';

const logger = new Logger('TestWorker');
const backstop = require('backstopjs');

interface IWorkerState {
    config: IConfig;
    scope: {
        tenantId: string;
        userId: string;
        runId: string;
    },
    execution: {
        failed: boolean;
        error: any;
        jsonReport: IReport;
    }
}

export class TestWorker {

    private state: IWorkerState;
    private flow: S3Flow;
    private engine: EngineAdapter;

    constructor (engine?: EngineAdapter, flow?: S3Flow) {
        this.engine = engine || new EngineAdapter();
        this.flow = flow || new S3Flow();
    }

    async run (queueMessage:IIncomingQueueMessage) : Promise<IOutgoingQueueMessage> {

        this.state = {
            config: queueMessage.config,
            scope: {
                tenantId: queueMessage.tenantId,
                userId: queueMessage.userId,
                runId: queueMessage.runId,
            },
            execution: {
                failed: false,
                error: null,
                jsonReport: null
            }
        };

        logger.log('run:', this.state.scope);

        await this.flow.RunPreProcess(this.state.config);
        await this.executeTest();
        await this.readReport();
        await this.postProcessReport();
        return this.sendResultsToOutgoingQueue();
    }

    private async executeTest() {

        logger.log('Step: executeTest', this.state.scope);

        try {
            await backstop('test', { config: this.state.config } );
            this.state.execution.failed = false;
            this.state.execution.error = null;
        }
        catch (err) {
            logger.error('executeTest', err.message||err);
            this.state.execution.failed = true;
            this.state.execution.error = err;
        }
    }

    private async readReport () {

        logger.log('Step: readReport', this.state.scope);

        const jsonReport = await this.engine.getReport( this.state.config.paths.json_report );
        const reportAdapter = new JsonReportAdapter(
            jsonReport,
            this.state.config.paths.json_report,
            this.state.scope.runId);

        this.state.execution.jsonReport = reportAdapter.report;
    }

    private async postProcessReport () {

        logger.log('Step: postProcessReport', this.state.scope);

        const report:IReport = this.state.execution.jsonReport;
        const imageProcessor = new ImageProcessor();
        const filePathsService = new FilePathsService();

        for ( let i = 0; i < report.tests.length; i++ ) {

            const testPair = report.tests[i].pair;
            const images = testPair.images.absolute;

            const resized = await Promise.all([
                await imageProcessor.resizeTestResult( images.test ),
                await imageProcessor.resizeTestResult( images.diff ),
            ]);

            const meta_testLG = resized[0];
            const meta_diffImageLG = resized[1];

            testPair.meta_testLG = filePathsService.relativeToVrtDataPath( meta_testLG );
            testPair.meta_diffImageLG = filePathsService.relativeToVrtDataPath( meta_diffImageLG );

            await this.flow.RunPostProcess({
                ref: images.ref,
                diff: images.diff,
                test: images.test,
                meta_testLG: meta_testLG,
                meta_diffImageLG: meta_diffImageLG
            });
        }
    }

    private sendResultsToOutgoingQueue(): IOutgoingQueueMessage {

        logger.log('Step: sendResultsToOutgoingQueue', this.state.scope);

        return {
            tenantId: this.state.scope.tenantId,
            userId: this.state.scope.userId,
            runId: this.state.scope.runId,
            report: this.state.execution.jsonReport
        }
    }
}
