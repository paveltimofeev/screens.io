import { IConfig, IIncomingQueueMessage, IOutgoingQueueMessage, IReport, IScenario, IViewport } from './models';
import { S3Flow } from './s3-flow';
import { Logger } from './utils';
import { AppFactory } from './app-factory';

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
    private factory: AppFactory;
    private flow: S3Flow;

    constructor (factory: AppFactory) {

        this.factory = factory;
        this.flow = this.factory.createFlow();
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

        const engine = this.factory.createEngineAdapter();

        const jsonReport = await engine.getReport( this.state.config.paths.json_report );
        const reportAdapter = this.factory.createJsonReportAdapter(
            jsonReport,
            this.state.config.paths.json_report,
            this.state.scope.runId);

        this.state.execution.jsonReport = reportAdapter.report;
    }

    private async postProcessReport () {

        logger.log('Step: postProcessReport', this.state.scope);

        const report:IReport = this.state.execution.jsonReport;

        for ( let i = 0; i < report.tests.length; i++ ) {

            const testPair = report.tests[i].pair;
            const images = testPair.images.absolute;

            await this.flow.RunPostProcess({
                diff: images.diff,
                test: images.test
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
