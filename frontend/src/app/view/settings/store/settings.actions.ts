import { createAction, props } from '@ngrx/store';
import { IViewport } from './settings.reducer';


export const refreshViewports = createAction('[Settings Component] refreshViewports');
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
