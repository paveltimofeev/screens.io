import { createReducer, on } from '@ngrx/store';
import * as actions from './configuration.actions';

export interface ConfigurationState {
  viewportsList: string[];
  scenariosList: string[];
  currentScenario: any;
  scenarios: any[];
}
export interface AppState {
  configurationView: ConfigurationState
}
export const initState = {
  viewportsList: [],
  scenariosList: [],
  currentScenario: {},
  scenarios: []
};

const _reducer = createReducer(initState,
  on(actions.loaded, (state, actions:any) => {
    return {
      ...state,
      viewportsList: actions.payload.viewportsList,
      scenariosList: actions.payload.scenariosList,
      scenarios: actions.payload.scenarios,
      currentScenario: actions.payload.scenarios && actions.payload.scenarios.length > 0 ? actions.payload.scenarios[0] : {},
      error: null
    }
  }),

  on(actions.error, (state, actions:any) => {
    return {
      ...state,
      error: actions.payload
    }
  }),

  on(actions.changeCurrentScenario, (state, actions:any) => {

    return {
      ...state,
      currentScenario: state.scenarios.find(x => x.label === actions.label)
    }
  })
);

export function configurationReducer (state, action) {
  return _reducer(state, action)
}
