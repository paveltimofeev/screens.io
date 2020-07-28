import { createAction, props } from '@ngrx/store';

export const cleanupNgrxStorage = createAction('[App Api Component] cleanupNgrxStorage');

export const operationCompleted = createAction(
  '[App Api Component] operationCompleted',
  props<{
    payload: {
      correlationId: string,
      success: boolean,
      error?: any
    }
  }>()
);

export const runFilteredScenariosOp = createAction(
  '[App Api Component] runFilteredScenariosOp',
  props<{ payload:
      {
      correlationId: string,
      scenarios: string[],
      viewports: string[]
    } }>()
);


export const breakJobExecution = createAction(
  '[App Api Component] breakJobExecution',
  props<{ payload:
      {
        correlationId: string,
        jobId: string
      } }>()
);
