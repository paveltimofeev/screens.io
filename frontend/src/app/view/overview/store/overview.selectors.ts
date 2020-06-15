import { createSelector } from '@ngrx/store';
import { AppState, OverviewState } from './overview.reducer';

export const selectFeature = (state:AppState) => state.overview;

export const favoriteScenarios = createSelector(
  selectFeature,
  (state: OverviewState) => state.favoriteScenarios
);

export const recentJobs = createSelector(
    selectFeature,
    (state: OverviewState) => state.recentJobs
);

export const stats = createSelector(
    selectFeature,
    (state: OverviewState) => { return {
        totalState: state.totalState,
        totalScenarios: state.totalScenarios,
        totalViewports: state.totalViewports,
        lastRunTime: state.lastRunTime,
    }}
);


export const runFilteredWidgetData = createSelector(
  selectFeature,
  (state: OverviewState) => { return {
    scenarios: state.scenariosLabels,
    viewports: state.viewportsLabels,
  }}
);
