import { IQueueMessage, IScenario, IViewport } from './models';


export class TestWorker {

    run (queueMessage:IQueueMessage) {

        console.log('[TestWorker] run: \n', JSON.stringify({
            tenantId: queueMessage.tenantId,
            userId: queueMessage.userId,
            runId: queueMessage.runId,
            scenarios: queueMessage.config.scenarios.map( (x:IScenario) => x._id ),
            viewports: queueMessage.config.viewports.map( (x:IViewport) => x.label )
        }, null, 2));

        this.downloadReference();
        this.executeTest();
        this.resizeResultImages();
        this.uploadResultImages();
        this.sendResultsToOutgoingQueue();
    }

    private downloadReference() {
        console.log('[TestWorker] Step: downloadReference')
    }
    private executeTest() {
        console.log('[TestWorker] Step: executeTest')
    }
    private resizeResultImages() {
        console.log('[TestWorker] Step: resizeResultImages')
    }
    private uploadResultImages() {
        console.log('[TestWorker] Step: uploadResultImages')
    }
    private sendResultsToOutgoingQueue() {
        console.log('[TestWorker] Step: sendResultsToOutgoingQueue')
    }
}
