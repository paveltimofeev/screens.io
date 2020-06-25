import { createAction, props } from '@ngrx/store';
import { IJobRecord } from '../../../models/app.models';

export const refresh = createAction('[Jobs Component] refresh');
export const loadMore = createAction('[Jobs Component] loadMore');
export const loaded = createAction('[Jobs Component] loaded', props<{
  payload: {
    jobs: IJobRecord[],
    latestRowStartedAt: string
  }
}>());
export const loadedMore = createAction('[Jobs Component] loadedMore', props<{
  payload: {
    jobs: IJobRecord[],
    latestRowStartedAt: string
  }
}>());

export const cleanupNgrxStorage = createAction('[Jobs Component] cleanupNgrxStorage');

/* COMMANDS: PAGE ACTIONS */
export const purgeHistory = createAction('[Jobs Component] purgeHistory');

/* COMMANDS: FILTERS ACTIONS */
export const setFilter = createAction('[Jobs Component] setFilter', props<{payload: {key:string, value:string}}>());
export const removeFilter = createAction('[Jobs Component] removeFilter', props<{payload: {key:string, value:string}}>());
