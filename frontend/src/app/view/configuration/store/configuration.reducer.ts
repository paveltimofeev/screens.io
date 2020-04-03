import { createReducer, on } from '@ngrx/store';
import * as actions from './configuration.actions';

export interface ConfigurationState {
  viewports: any[];
  scenarios: any[];
}
export interface AppState {
  configurationView: ConfigurationState
}
export const initState = {
  viewports: [],
  scenarios: []
}

const _reducer = createReducer(initState,
  on(actions.loaded, (state, actions:any) => {
    return {
      ...state,
      ...actions.payload,
      error: null
    }
  }),

  on(actions.error, (state, actions:any) => {
    return {
      ...state,
      error: actions.payload
    }
  })
);

export function configurationReducer (state, action) {
  return _reducer(state, action)
}
