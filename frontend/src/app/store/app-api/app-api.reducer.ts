import { createReducer, on } from '@ngrx/store';
import * as actions from './app-api.actions'
import { IOperationResult } from './app-api.models';

export interface AppState {
  appApi: AppApiState
}

export interface AppApiState {
  operationResult: IOperationResult;
}

export const initState = {
  operationResult: {}
};

const _reducer = createReducer(initState,

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

export function appApiReducer (state, action) {

  return _reducer(state, action)
}
