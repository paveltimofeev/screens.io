import { AppState, SettingsState } from './settings.reducer';
import { createSelector } from '@ngrx/store';

export const selectFeature = (state:AppState) => state.settings;

export const accountInfo = createSelector(
  selectFeature,
  (state: SettingsState) => state.accountInfo
);

export const viewports = createSelector(
  selectFeature,
  (state: SettingsState) => state.viewports
);

export const operationCorrelationId = createSelector(
  selectFeature,
  (state: SettingsState) => state.operationCorrelationId
);

