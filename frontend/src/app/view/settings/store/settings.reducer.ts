import { createReducer, on } from '@ngrx/store';
import * as actions from './settings.actions'
import { operationCompleted } from './settings.actions';

export interface IAccountInfo {
}
export interface IViewport {
}

export interface AppState {
  settings: SettingsState
}
export interface SettingsState {
  accountInfo: any;
  viewports: any[];
  operationCorrelationId: string;
}

export const initState = {
  accountInfo: {},
  viewports: [],
  operationCorrelationId: null
};

const _reducer = createReducer(initState,

  on(actions.loadedAccountInfo, (state, action) => {

    return {
      ...state,
      accountInfo: action.payload
    }
  }),

  on(actions.loadedViewports, (state, action) => {

    return {
      ...state,
      viewports: action.payload
    }
  }),

  on(actions.operationCompleted, (state, action) => {

    return {
      ...state,
      operationCorrelationId: action.payload.correlationId
    }
  }),

  on(actions.cleanupNgrxStorage, (state, action) => {

    return initState
  })
);

export function settingsReducer (state, action) {

  return _reducer(state, action)
}
