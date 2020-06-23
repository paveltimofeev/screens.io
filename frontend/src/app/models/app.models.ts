export interface IScenario {

  _id:string;

  hideSelectors: string[];
  removeSelectors: string[];
  clickSelectors: string[];
  hoverSelectors: string[];
  selectors: string[];
  stubContentRules: string[];
  label: string;
  url: string,
  delay: number;
  misMatchThreshold: number;
  postInteractionWait: number;
  meta_recentRunStatus: string,
  authConfig: {
    enabled: boolean;
    loginPage: string;
    loginSelector: string;
    loginValue: string;
    passwordSelector: string;
    passwordValue: string;
    submitSelector: string;
  },
  meta_isFavorite: boolean;
  meta_referenceImageUrl: string;
}

export interface IViewport {
  _id?: string;
  label: string;
  width: number;
  height: number;
  enabled?: boolean;
}

export interface IScenarioHistory {
  jobId:string,
  state: string,
  startedAt: string,
  startedBy: string,
  upic: string,
}
