import { createSelector } from '@ngrx/store';
import { AppState, JobPageState } from './job-page.reducer';

export const selectFeature = (state:AppState) => state.jobPage;

export const jobTitle = createSelector(
  selectFeature,
  (state: JobPageState) => state.title
);

