import { createAction, props } from '@ngrx/store';

export const refreshAccountInfo = createAction('[Account Api Component] refreshAccountInfo');
export const loadedAccountInfo = createAction('[Account Api Component] loadedAccountInfo', props<{payload:any}>());

export const cleanupNgrxStorage = createAction('[Account Api Component] cleanupNgrxStorage');

export const operationCompleted = createAction(
  '[Account Api Component] operationCompleted',
  props<{
    payload: {
      correlationId: string,
      success: boolean,
      error?: any
    }
  }>()
);

export const updateAccountInfoOp = createAction(
  '[Account Api Component] updateAccountInfo',
  props<{ payload: {
      accountInfo: any,
      correlationId: string
    } }>()
);
export const updatePasswordOp = createAction(
  '[Account Api Component] updatePassword',
  props<{ payload: {
      currentPassword: string,
      newPassword: string,
      correlationId: string
    }}>()
);
export const deleteAccountOp = createAction(
  '[Account Api Component] deleteAccount',
  props<{ payload: {
      password: string,
      correlationId: string
    }}>()
);

