import { AppState, SettingsState } from './settings.reducer';
import { createSelector } from '@ngrx/store';

export const selectFeature = (state:AppState) => state.settings;

export const viewports = createSelector(
  selectFeature,
  (state: SettingsState) => state.viewports
);

export const viewportsData = createSelector(
  selectFeature,
  (state: SettingsState) => state.viewportsData
);

export const selectedViewports = createSelector(
  selectFeature,
  (state: SettingsState) => state.selectedViewports
);

export const operationResult = createSelector(
  selectFeature,
  (state: SettingsState) => state.operationResult
);

