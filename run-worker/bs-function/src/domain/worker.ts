import {
    IEngine, IEngineTestResult, IFlow,
    IIncomingQueueMessage, ILogger,
    IOutgoingQueueMessage,
    IReport, IWorkerState
} from './models';
import { AppFactory } from '../app/app-factory';


export class TestWorker {

    private state: IWorkerState;
    private factory: AppFactory;
    private flow: IFlow;
    private engine: IEngine;
    private logger: ILogger;

    constructor (factory: AppFactory) {

        this.factory = factory;
        this.flow = this.factory.createFlow();
        this.engine = this.factory.createEngine();
        this.logger = this.factory.createLogger('TestWorker')
    }

    async run (queueMessage:IIncomingQueueMessage) : Promise<IOutgoingQueueMessage> {

        // Fix: override engine_scripts location got from incoming message
        queueMessage.config.paths.engine_scripts = 'engine_scripts';

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

        this.logger.log('run:', this.state.scope);

        await this.flow.RunPreProcess(this.state.config);
        await this.executeTest();
        await this.readReport();
        await this.postProcessReport();
        return this.sendResultsToOutgoingQueue();
    }

    private async executeTest() {

        this.logger.log('Step: executeTest', this.state.scope);

        const result: IEngineTestResult = await this.engine.test(this.state.config);
        this.state.execution.failed = !result.success;
        this.state.execution.error = result.error;
    }

    private async readReport () {

        this.logger.log('Step: readReport', this.state.scope);

        const engineAdapter = this.factory.createEngineAdapter();

        const jsonReport = await engineAdapter.getReport( this.state.config.paths.json_report );
        const reportAdapter = this.factory.createJsonReportAdapter(
            jsonReport,
            this.state.config.paths.json_report,
            this.state.scope.runId);

        this.state.execution.jsonReport = reportAdapter.report;
    }

    private async postProcessReport () {

        this.logger.log('Step: postProcessReport', this.state.scope);

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

        this.logger.log('Step: sendResultsToOutgoingQueue', this.state.scope);

        return {
            tenantId: this.state.scope.tenantId,
            userId: this.state.scope.userId,
            runId: this.state.scope.runId,
            report: this.state.execution.jsonReport
        }
    }
}
