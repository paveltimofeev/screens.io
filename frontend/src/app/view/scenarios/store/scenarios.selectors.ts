import { AppState, ScenariosState } from './scenarios.reducer';
import { createSelector } from '@ngrx/store';

export const selectFeature = (state:AppState) => state.scenarios;

export const scenariosList = createSelector(
  selectFeature,
  (state: ScenariosState) => state.scenariosList.filter( x => {
    return state.searchFilter === '' || x.label.toLowerCase().indexOf(state.searchFilter) > -1
  })
);

export const viewportsList = createSelector(
  selectFeature,
  (state: ScenariosState) => state.viewportsList
);

export const fullHeightModeOn = createSelector(
  selectFeature,
  (state: ScenariosState) => state.fullHeightModeOn
);

export const filters = createSelector(
  selectFeature,
  (state: ScenariosState) => state.filters
);
