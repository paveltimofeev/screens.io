import { createSelector } from '@ngrx/store';
import { AppState, HistoryTableState } from './history-table.reducer';

export const selectFeature = (state: AppState) => state.historyTable;

export const selectHistoryTable = createSelector(
  selectFeature,
  (state:HistoryTableState) => state.jobs
);
