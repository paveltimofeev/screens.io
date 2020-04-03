import { createAction } from '@ngrx/store';

export const refresh = createAction('[Configuration] refresh');
export const loaded = createAction('[Configuration] loaded');
export const error = createAction('[Configuration] error');
