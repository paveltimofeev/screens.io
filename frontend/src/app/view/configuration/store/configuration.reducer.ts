import { createReducer, on } from '@ngrx/store';
import * as actions from './configuration.actions';
import { favoriteScenario } from './configuration.actions';
import { deleteScenario } from './configuration.actions';

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

  on(actions.deleteScenario, (state, actions:any) => {
    return {
      ...state,
      scenarios : state.scenarios.filter(s => s._id !== actions.payload.id)
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

  on(actions.cleanupNgrxStorage, (state, action) => {

    return initState
  })
);

export function configurationReducer (state, action) {
  return _reducer(state, action)
}
