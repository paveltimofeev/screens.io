import { createAction, props } from '@ngrx/store';
//import { OverviewState } from './overview.reducer';

export const refresh = createAction('[Overview Component] refresh');
export const loaded = createAction( '[Overview Component] loaded', props<{payload: any}>() );
export const cleanupNgrxStorage = createAction('[Overview Component] cleanupNgrxStorage');

