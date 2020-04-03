import { createAction } from '@ngrx/store';

export const refresh = createAction('[Dashboard Component] refresh');

export const loadStats = createAction('[Dashboard Component] loadStats');
export const loadScenarios = createAction('[Dashboard Component] loadScenarios');
export const loadHistory = createAction('[Dashboard Component] loadHistory');

export const loaded = createAction('[Dashboard Component] loaded');
export const error = createAction('[Dashboard Component] error');
