import { AppState, AccountApiState } from './account-api.reducer';
import { createSelector } from '@ngrx/store';

export const selectFeature = (state:AppState) => state.accountApi;

export const accountInfo = createSelector(
  selectFeature,
  (state: AccountApiState) => state.accountInfo
);

export const operationResult = createSelector(
  selectFeature,
  (state: AccountApiState) => state.operationResult
);
