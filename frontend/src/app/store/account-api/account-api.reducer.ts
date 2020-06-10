import { createReducer, on } from '@ngrx/store';
import * as actions from './account-api.actions'
import { IAccountInfo, IOperationResult } from './account-api.models';

export interface AppState {
  accountApi: AccountApiState
}

export interface AccountApiState {
  accountInfo: IAccountInfo;
  operationResult: IOperationResult;
}

export const initState = {
  accountInfo: {},
  operationResult: {}
};

const _reducer = createReducer(initState,

  on(actions.loadedAccountInfo, (state, action) => {

    return {
      ...state,
      accountInfo: action.payload
    }
  }),

  on(actions.operationCompleted, (state, action) => {

    return {
      ...state,
      operationResult: action.payload
    }
  }),

  on(actions.cleanupNgrxStorage, (state, action) => {

    return initState
  })
);

export function accountApiReducer (state, action) {

  return _reducer(state, action)
}
