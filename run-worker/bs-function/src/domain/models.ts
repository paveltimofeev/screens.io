import { bool } from 'aws-sdk/clients/signer';

export interface IAppConfig {

    enableLogging: boolean,
    vrtDataFullPath: string;
    bucketName: string;
    incomingQueue: {
        queueUrl: string;
        pollingInterval: number;
        maxNumberOfMessages: number;
        visibilityTimeout: number;
        waitTimeSeconds: number;
    },
    outgoingQueue: {
        queueUrl: string;
    };
    resizeConfig: {
        fit: string;
        position: string;
        withoutEnlargement: boolean;
    }
    resizeOpts: {
        sm: IResizeOption;
        md: IResizeOption;
        lg: IResizeOption;
    }
}


export interface IResizeOption {
    width: number;
    height?: number;
    quality?: number;
}


export interface IViewport {

    label: string,
    width: number,
    height: number,
    enabled: boolean
}


export interface IScenario {

    _id: string,
    label: string,
    url: string,

    hideSelectors?: string[],
    removeSelectors?: string[],
    selectors?: string[],
    stubContentRules?: any[],

    authConfig?: { enabled: boolean },

    meta_recentRunStatus?: string,
    meta_referenceImageUrl?: string,
    meta_referenceLG?: string,
    meta_referenceMD?: string,
    meta_referenceSM?: string
}


export interface IConfig {

    id?: string,
    viewports: IViewport[],
    scenarios: IScenario[],
    onBeforeScript: string,
    onReadyScript: string,
    report: string[],
    engine: string,
    engineOptions: any,
    asyncCaptureLimit: number,
    asyncCompareLimit: number,
    debug: boolean,
    debugWindow: boolean,
    paths: {
        bitmaps_reference: string,
        engine_scripts: string,
        bitmaps_test: string,
        html_report: string,
        ci_report: string,
        json_report: string
    }
}


export interface IIncomingQueueMessage {

    tenantId: string;
    userId: string;
    runId: string;
    config: IConfig;

    ctx?: {
        tenant: string;
        userid: string;
    }
}


export interface IOutgoingQueueMessage {

    tenantId: string;
    userId: string;
    runId: string;
    report: IReport;
}


export interface IJsonReport {

    id: string;
    testSuite: string;
    tests: IJsonReportTestCase[];
}


export interface IJsonReportTestCase {

    status: string; // fail, pass
    pair: {
        reference: string;
        test: string;
        diffImage: string;

        url: string;
        label: string;
        viewportLabel: string;

        fileName: string;
        selector: string;
        misMatchThreshold: number;
        expect: number;

        diff: {
            isSameDimensions: false;
            dimensionDifference: {
                width: number;
                height: number;
            };
            misMatchPercentage: string;
            analysisTime: number
        };

        /// Extended
        images: {
            absolute: {
                ref: string;
                test: string;
                diff: string;
            },
            relative: {
                ref: string;
                test: string;
                diff: string;
            }
        },
        meta_testLG: string;
        meta_diffImageLG: string;
    };
}


export interface IReport extends IJsonReport {
    runId?: string;
    tests: IJsonReportTestCase[];
}


export interface IWorkerState {
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


export interface IEngine {

    test(config:IConfig): Promise<IEngineTestResult>;
}


export interface IEngineTestResult {
    success: boolean;
    error?: any;
}


export interface IFlow {

    RunPreProcess(config:IConfig): Promise<any>;
    RunPostProcess(images: {
        diff: string;
        test: string;
    }): Promise<any>;
}


export interface ILogger {

    log (message:string, args?:any): void;
    error (message:string, args?:any): void;
}
