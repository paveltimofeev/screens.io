import { createAction } from '@ngrx/store';

export const refresh = createAction('refresh');
export const loaded = createAction('loaded');
export const error = createAction('error');
