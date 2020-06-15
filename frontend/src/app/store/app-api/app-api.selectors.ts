import { AppState, AppApiState } from './app-api.reducer';
import { createSelector } from '@ngrx/store';

export const selectFeature = (state:AppState) => state.appApi;


export const operationResult = createSelector(
  selectFeature,
  (state: AppApiState) => state.operationResult
);
