import { createSelector } from '@ngrx/store';
import { AppState, ConfigurationState } from './configuration.reducer';

export const selectFeature = (state:AppState) => state.configurationView;

export const selectViewports = createSelector(
  selectFeature,
  (state:ConfigurationState) => state.viewports
);

export const selectScenarios = createSelector(
  selectFeature,
  (state:ConfigurationState) => state.scenarios
);

