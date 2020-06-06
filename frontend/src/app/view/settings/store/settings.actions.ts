import { createAction, props } from '@ngrx/store';
import { IViewport } from './settings.reducer';


export const refreshAccountInfo = createAction('[Settings Component] refreshAccountInfo');
export const refreshViewports = createAction('[Settings Component] refreshViewports');

export const loadedAccountInfo = createAction('[Settings Component] loadedAccountInfo', props<{payload:any}>());
export const loadedViewports = createAction('[Settings Component] loadedViewports', props<{payload:IViewport[]}>());

export const cleanupNgrxStorage = createAction('[Settings Component] cleanupNgrxStorage');

export const operationCompleted = createAction(
  '[Settings Component] operationCompleted',
  props<{
    payload: {
      correlationId: string,
      success: boolean,
      error?: any
    }
  }>()
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


export const addCustomViewport = createAction(
  '[Settings Component] addCustomViewport',
  props<{ payload: IViewport }>()
);
export const selectViewports = createAction(
  '[Settings Component] selectViewports',
  props<{ payload: { viewports:any[] } }>()
);
export const updateViewports = createAction(
  '[Settings Component] updateViewports',
  props<{ payload: { correlationId: string } }>()
);



export const cleanupUpdateViewportsError = createAction(
  '[Settings Component] cleanupUpdateViewportsError'
);


