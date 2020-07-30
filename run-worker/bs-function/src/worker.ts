import { S3Flow } from './s3-flow';
import { IConfig, IQueueMessage, IScenario, IViewport } from './models';
import { EngineAdapter, JsonReportAdapter } from './engine-adapter';
import { FilePathsService } from './file-paths-service';
import { ImageProcessor } from './image-processor';

const backstop = require('backstopjs');


const log = (message:string, args?:any) => {
    if (args) {
        console.log(message + '\n', JSON.stringify(args, null, 2));
    }
    else {
        console.log(message)
    }
};


export class TestWorker {

    private state?: {
        readonly config: IConfig;
        readonly scope: {
            readonly tenantId: string;
            readonly userId: string;
            readonly runId: string;
        },
        execution: {
            failed: boolean
            error: any
        }
    };

    private flow = new S3Flow();
    private engine = new EngineAdapter();

    async run (queueMessage:IQueueMessage) {

        this.state = {
            ...this.state,
            config: queueMessage.config,
            scope: {
                tenantId: queueMessage.tenantId,
                userId: queueMessage.userId,
                runId: queueMessage.runId,
            },
            execution: {
                failed: false,
                error: null
            }
        };

        log('[TestWorker] run:', {
            scope: this.state.scope,
            scenarios: this.state.config!.scenarios.map( (x:IScenario) => x._id ),
            viewports: this.state.config!.viewports.map( (x:IViewport) => x.label )
        });


        await this.flow.RunPreProcess(this.state.config);
        await this.executeTest();
        const data = await this.postProcessReport();


        // this.downloadReference();
        // this.executeTest();
        // this.resizeResultImages();
        // this.uploadResultImages();
        this.sendResultsToOutgoingQueue();
    }

    async postProcessReport () {

        const jsonReport = await this.engine.getReport( this.state.config.paths.json_report );
        const runId = this.state.scope.runId;
        const reportLocation = this.state.config.paths.json_report;

        console.log('[TestWorker] postProcessReport', runId, reportLocation);

        const reportAdapter = new JsonReportAdapter(jsonReport, reportLocation, runId);
        let report = reportAdapter.report;

        const imageProcessor = new ImageProcessor();

        for ( let i = 0; i < report.tests.length; i++ ) {

            const results = await Promise.all([
                await imageProcessor.resizeTestResult( report.tests[i].pair.images.absolute.test ),
                await imageProcessor.resizeTestResult( report.tests[i].pair.images.absolute.diff ),
            ]);

            const meta_testLG = results[0];
            const meta_diffImageLG = results[1];

            const filePathsService = new FilePathsService();
            report.tests[i].pair.meta_testLG = filePathsService.relativeToVrtDataPath( meta_testLG );
            report.tests[i].pair.meta_diffImageLG = filePathsService.relativeToVrtDataPath( meta_diffImageLG );

            await this.flow.RunPostProcess({
                ref: report.tests[i].pair.images.absolute.ref,
                diff: report.tests[i].pair.images.absolute.diff,
                test: report.tests[i].pair.images.absolute.test,
                meta_testLG: meta_testLG,
                meta_diffImageLG: meta_diffImageLG
            });
        }

        return report
    }

    private async downloadReference() {
        log('[TestWorker] Step: downloadReference',
            {
                references: this.state!.config.scenarios.map((x: IScenario) => x.meta_referenceImageUrl),
                referencesDir: this.state!.config.paths.bitmaps_reference
            }
        )
    }

    private async executeTest() {

        log('[TestWorker] Step: executeTest');

        try {
            let result = await backstop('test', { config: this.state!.config } );
        }
        catch (err) {
            log('[TestWorker] ERROR: executeTest', err.message||err);
            this.state.execution.failed = true;
            this.state.execution.error = err;
        }
    }

    private async resizeResultImages() {
        log('[TestWorker] Step: resizeResultImages')
    }

    private async uploadResultImages() {
        log('[TestWorker] Step: uploadResultImages')
    }

    private sendResultsToOutgoingQueue() {
        log('[TestWorker] Step: sendResultsToOutgoingQueue')
    }
}
