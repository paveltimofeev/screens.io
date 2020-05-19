import { createAction, props } from '@ngrx/store';
import { IQueryFilter } from '../../../services/filters.service';

export const refresh = createAction('[History Table] refresh', props<{payload?: {filters?:IQueryFilter[]}}>());
export const cleanupNgrxStorage = createAction('[History Table] cleanupNgrxStorage');
export const loaded = createAction('[History Table] loaded');
export const error = createAction('[History Table] error');
export const clearRecord = createAction('[History Table] clearRecord', props<{payload:any}>());
export const clearAllRecords = createAction('[History Table] clearAllRecords');

