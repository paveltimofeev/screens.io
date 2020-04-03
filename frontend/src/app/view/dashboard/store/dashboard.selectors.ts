import { createSelector } from '@ngrx/store';

export interface DashboardState {
  scenarios: any[]
}

export interface AppState {
  dashboard: DashboardState
}

export const selectFeature = (state:AppState) => state.dashboard;

export const selectScenarios = createSelector(
  selectFeature,
  (state: DashboardState) => state.scenarios
);
