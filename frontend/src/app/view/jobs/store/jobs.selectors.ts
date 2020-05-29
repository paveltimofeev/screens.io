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

