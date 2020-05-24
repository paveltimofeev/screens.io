import { AppState, ScenarioPageState } from './scenario-page.reducer';
import { createSelector } from '@ngrx/store';

export const selectFeature = (state:AppState) => state.scenarioPage;

export const title = createSelector(
  selectFeature,
  (state: ScenarioPageState) => state.title
);

export const scenario = createSelector(
  selectFeature,
  (state: ScenarioPageState) => state.scenario
);

export const scenarioHistory = createSelector(
  selectFeature,
  (state: ScenarioPageState) => state.scenarioHistory.jobs
);
