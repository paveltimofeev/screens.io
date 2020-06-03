import { createAction, props } from '@ngrx/store';


export const refreshAccountInfo = createAction('[Settings Component] refreshAccountInfo');
export const refreshViewports = createAction('[Settings Component] refreshViewports');

export const loadedAccountInfo = createAction('[Settings Component] loadedAccountInfo', props<{payload:any}>());
export const loadedViewports = createAction('[Settings Component] loadedViewports', props<{payload:any[]}>());

export const cleanupNgrxStorage = createAction('[Settings Component] cleanupNgrxStorage');

export const operationCompleted = createAction(
  '[Settings Component] operationCompleted',
  props<{payload:{correlationId:string}}>()
);


export const updateAccountInfo = createAction(
  '[Settings Component] updateAccountInfo',
  props<{ payload: {
      accountInfo: any,
      correlationId: string
    } }>()
);
export const updatePassword = createAction(
  '[Settings Component] updatePassword',
  props<{ payload: { updatedPassword: any, correlationId: string } }>()
);
export const deleteAccount = createAction(
  '[Settings Component] deleteAccount',
  props<{ payload: any }>()
);


export const addViewport = createAction(
  '[Settings Component] addViewport',
  props<{ payload: { name:string, width:number, height: number } }>()
);
export const updateViewports = createAction(
  '[Settings Component] updateViewports',
  props<{ payload: { viewports:any[], correlationId: string } }>()
);
