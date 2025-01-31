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
  expect: number;
  selectorExpansion: boolean;
  readySelector: string;
  readyEvent: string;
  scrollToSelector: string;

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
  meta_referenceSM: string;
  meta_referenceMD: string;
  meta_referenceLG: string;
}

export interface IViewport {
  _id?: string;
  label: string;
  width: number;
  height: number;
  enabled?: boolean;
}

export interface IJobRecord {
  _id: string;
  runId: string;
  date: string,
  duration: string;
  status: string;
  scope: string;
  viewports: string;
  user: string;
}

export interface IScenarioHistory {
  jobId:string,
  state: string,
  startedAt: string,
  startedBy: string,
  upic: string,
}
