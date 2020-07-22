import { createSelector } from '@ngrx/store';
import { AppState, JobPageState } from './job-page.reducer';

export const selectFeature = (state:AppState) => state.jobPage;

export const jobTitle = createSelector(
  selectFeature,
  (state: JobPageState) => state.title
);

export const isRunning = createSelector(
  selectFeature,
  (state: JobPageState) => state.isRunning
);
export const breadcrumbTitle = createSelector(
  selectFeature,
  (state: JobPageState) => state.breadcrumbTitle
);
export const resultStats = createSelector(
  selectFeature,
  (state: JobPageState) => state.resultStats
);

export const cases = createSelector(
  selectFeature,
  (state: JobPageState) => state.cases.filter( x => {
    return state.searchFilter === '' || x.label.toLowerCase().indexOf(state.searchFilter) > -1
  })
);

export const failedCases = createSelector(
  selectFeature,
  (state: JobPageState) => state.cases.filter( x => {
    return x.status === 'fail'
  })
);

export const viewports = createSelector(
  selectFeature,
  (state: JobPageState) => state.viewports
);

export const jobDescriptionInfo = createSelector(
  selectFeature,
  (state: JobPageState) => ({
    scenarios: state.scenarios,
    viewports: state.viewports,
    startedBy: state.startedBy
  })
);

export const sidebarHeaderInfo = createSelector(
  selectFeature,
  (state: JobPageState) => ({
    totalCases: state.totalCases,
    failedCases: state.failedCases,
    status: state.status
  })
);

export const fullHeightModeOn = createSelector(
  selectFeature,
  (state: JobPageState) => state.fullHeightModeOn
);

export const imageMode = createSelector(
  selectFeature,
  (state: JobPageState) => state.imageMode
);
