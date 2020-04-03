import { createSelector } from '@ngrx/store';
import { AppState, DashboardState } from './dashboard.reducer';

export const selectFeature = (state:AppState) => state.dashboard;

export const selectScenarios = createSelector(
  selectFeature,
  (state: DashboardState) => state.scenarios
);
