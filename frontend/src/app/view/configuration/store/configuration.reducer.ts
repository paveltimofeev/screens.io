import { createReducer, on } from '@ngrx/store';
import * as actions from './configuration.actions';

export interface ConfigurationState {
  viewportsList: string[];
  scenariosList: string[];
  currentScenario: any;
  currentScenarioHistory: any[];
  scenarios: any[];
  loading: boolean;
}
export interface AppState {
  configurationView: ConfigurationState
}
export const initState = {
  viewportsList: [],
  scenariosList: [],
  currentScenario: {},
  currentScenarioHistory: [],
  scenarios: [],
  loading: false
};

const _reducer = createReducer(initState,
  on(actions.loaded, (state, actions:any) => {

    return {
      ...state,
      ...actions.payload,

      error: null,
      loading: false
    }
  }),

  on(actions.error, (state, actions:any) => {
    return {
      ...state,
      error: actions.payload,
      loading: false
    }
  }),

  on(actions.updateScenario, (state, actions:any) => {
    return {
      ...state,
      loading: true
    }
  }),

  on(actions.createScenario, (state, actions:any) => {
    return {
      ...state,
      loading: true
    }
  }),

  on(actions.createViewport, (state, actions:any) => {
    return {
      ...state,
      loading: true
    }
  }),

  on(actions.setFavoriteResult, (state, actions:any) => {
    return {
      ...state,
      currentScenario: {
        ...state.currentScenario,
        meta_isFavorite: actions.payload
      }
    }
  })

);

export function configurationReducer (state, action) {
  return _reducer(state, action)
}
