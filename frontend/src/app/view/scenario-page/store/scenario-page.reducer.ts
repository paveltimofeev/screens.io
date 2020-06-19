import { createReducer, on } from '@ngrx/store';
import * as actions from './scenario-page.actions'
import { IScenario, IScenarioHistory } from '../../../models/app.models';

export interface AppState {
  scenarioPage: ScenarioPageState
}
export interface ScenarioPageState {
  title: string;
  scenario: IScenario;
  scenarioHistory: {
    id: string,
    jobs: IScenarioHistory[]
  }
}

export const initState = {
  title: '',
  scenario: {authConfig:{}},
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
        label: 'NewScenario',
        authConfig: {}
      }
    }
  }),

  on(actions.loadedScenarioHistory, (state, action) => {

    return {
      ...state,
      scenarioHistory: action.payload
    }
  }),

  on(actions.setScenarioProp, (state, action) => {

    let change = {};

    if (!action.payload.isArray && !action.payload.parentField) {

      change[action.payload.field] = action.payload.value;
    }
    else if (!action.payload.isArray && action.payload.parentField) {

      let nested = Object.assign({}, state.scenario[action.payload.parentField]);
      nested[action.payload.field] = action.payload.value;
      change[action.payload.parentField] = nested;
    }
    else {

      change[action.payload.field] = [
        ...(state.scenario[action.payload.field] || []),
        ...action.payload.value
      ]
    }

    return {
      ...state,
      scenario: {
        ...state.scenario,
        ...change
      }
    }
  }),

  on(actions.removeScenarioArrayValue, (state, action) => {

    let field = state.scenario[action.payload.field];
    let change = {};
    change[action.payload.field] = field.filter( x => x != field[action.payload.index]);

    return {
      ...state,
      scenario: {
        ...state.scenario,
        ...change
      }
    }
  }),

  on(actions.resetScenarioArrayValue, (state, action) => {

    let change = {};
    change[action.payload.field] = [];

    return {
      ...state,
      scenario: {
        ...state.scenario,
        ...change
      }
    }
  }),

  on(actions.cleanupNgrxStorage, (state, action) => {

    return initState
  })
);

export function scenarioPageReducer (state, action) {

  return _reducer(state, action)
}
