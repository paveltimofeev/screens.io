import { createAction, props } from '@ngrx/store';

export const refresh = createAction('[Scenarios Component] refresh');
export const loaded = createAction('[Scenarios Component] loaded', props<{payload:any[]}>());
export const cleanupNgrxStorage = createAction('[Scenarios Component] cleanupNgrxStorage');

/* COMMANDS: PAGE ACTIONS */
export const removFiltered = createAction('[Scenarios Component] removFiltered');
export const runFiltered = createAction('[Scenarios Component] runFiltered');

/* COMMANDS: DATA ACTIONS*/
export const switchFullHeightMode = createAction('[Scenarios Component] switchFullHeightMode');

/* COMMANDS: FILTERS ACTIONS */
export const setFilter = createAction('[Scenarios Component] setFilter', props<{payload: {key:string, value:string}}>());
export const removeFilter = createAction('[Scenarios Component] removeFilter', props<{payload: {key:string, value:string}}>());
