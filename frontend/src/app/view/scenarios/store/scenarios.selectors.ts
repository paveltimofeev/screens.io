import { AppState, ScenariosState } from './scenarios.reducer';
import { createSelector } from '@ngrx/store';

export const selectFeature = (state:AppState) => state.scenarios;

export const scenariosList = createSelector(
  selectFeature,
  (state: ScenariosState) => state.scenariosList
);

export const viewportsList = createSelector(
  selectFeature,
  (state: ScenariosState) => state.viewportsList
);

export const filters = createSelector(
  selectFeature,
  (state: ScenariosState) => state.filters
);
