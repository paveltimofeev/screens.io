import { createSelector } from '@ngrx/store';

export interface HistoryTableState {
  jobs: []
}

export interface AppState {
  historyTable: HistoryTableState
}

export const selectFeature = (state: AppState) => state.historyTable;

export const selectHistoryTable = createSelector(
  selectFeature,
  (state:HistoryTableState) => state.jobs
);
