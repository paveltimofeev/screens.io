import { createAction, props } from '@ngrx/store';

export const refresh = createAction('[History Table] refresh', props<{payload?: {filter?:{key:string, value:string}}}>());
export const loaded = createAction('[History Table] loaded');
export const error = createAction('[History Table] error');
export const clearRecord = createAction('[History Table] clearRecord', props<{payload:any}>());
export const clearAllRecords = createAction('[History Table] clearAllRecords');

