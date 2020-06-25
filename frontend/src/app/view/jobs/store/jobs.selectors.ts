import { AppState, JobsState } from './jobs.reducer';
import { createSelector } from '@ngrx/store';

export const selectFeature = (state:AppState) => state.jobs;

export const jobs = createSelector(
  selectFeature,
  (state: JobsState) => state.jobs
);


export const filters = createSelector(
  selectFeature,
  (state: JobsState) => state.filters
);

export const loadMoreOpts = createSelector(
  selectFeature,
  (state: JobsState) => ({
    filters: state.filters,
    latestRowStartedAt: state.latestRowStartedAt
  })
);

export const noMoreRecords = createSelector(
  selectFeature,
  (state: JobsState) => state.noMoreRecords
);
