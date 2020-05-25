import { createReducer, on } from '@ngrx/store';
import * as actions from './scenario-page.actions'

export interface IScenarioHistory {
  jobId:string,
  state: string,
  startedAt: string,
  startedBy: string,
  upic: string,
}

export interface AppState {
  scenarioPage: ScenarioPageState
}
export interface ScenarioPageState {
  title: string;
  scenario: any;
  scenarioHistory: {
    id: string,
    jobs: IScenarioHistory[]
  }
}

export const initState = {
  title: '',
  scenario: {},
  scenarioHistory: {
    id: null,
    jobs: []
  }
};

const _reducer = createReducer(initState,

  on(actions.loaded, (state, action) => {

    return {
      ...state,
      title: action.payload.label,
      scenario: action.payload
    }
  }),

  on(actions.initNewScenario, (state, action) => {

    return {
      ...state,
      scenario: {
        label: 'NewScenario'
      }
    }
  }),

  on(actions.loadedScenarioHistory, (state, action) => {

    return {
      ...state,
      scenarioHistory: action.payload
    }
  }),

  on(actions.cleanupNgrxStorage, (state, action) => {

    return initState
  })
);

export function scenarioPageReducer (state, action) {

  return _reducer(state, action)
}
