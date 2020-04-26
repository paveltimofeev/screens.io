import { createSelector } from '@ngrx/store';
import { AppState, ConfigurationState } from './configuration.reducer';

export const selectFeature = (state:AppState) => state.configurationView;

export const selectLoading = createSelector(
  selectFeature,
  (state:ConfigurationState) => state.loading
);

export const selectViewports = createSelector(
  selectFeature,
  (state:ConfigurationState) => state.viewportsList
);

export const selectScenarios = createSelector(
  selectFeature,
  (state:ConfigurationState) => state.scenariosList
);

export const selectCurrentScenario = createSelector(
  selectFeature,
  (state:ConfigurationState) => state.currentScenario
);

export const selectCurrentScenarioLabel = createSelector(
  selectFeature,
  (state:ConfigurationState) => state.currentScenario ? state.currentScenario.label : undefined
);

export const selectCurrentScenarioHistory = createSelector(
  selectFeature,
  (state:ConfigurationState) => state.currentScenarioHistory
);
