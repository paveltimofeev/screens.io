import { createAction, props } from '@ngrx/store';

export const refresh = createAction('[Job Page Component] refresh', props<{payload:{id:string}}>());
export const loaded = createAction( '[Job Page Component] loaded', props<{payload: any}>() );
export const cleanupNgrxStorage = createAction('[Job Page Component] cleanupNgrxStorage');

export const approve = createAction('[Job Page Component] approve', props<{payload:{scenarioId:string}}>());
export const runAgain = createAction('[Job Page Component] runAgain', props<{payload:any}>());
