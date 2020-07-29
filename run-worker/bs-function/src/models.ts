
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


export interface IQueueMessage {

    tenantId: string;
    userId: string;
    runId: string;
    config: IConfig;
}
