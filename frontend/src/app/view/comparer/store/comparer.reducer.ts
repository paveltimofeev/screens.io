import { createReducer, on } from '@ngrx/store';
import * as actions from './comparer.actions'

export interface AppState {
  comparer: ComparerState
}
export interface ComparerState {
  title: string;
  job: string;
  scenarioId: string;
  scenario: string;
  viewport: string;
  url: string;

  referenceImage: string;
  differenceImage: string;
  testImage: string;

  scenarios: string;
  viewports: string[];

  sizeMode: string;
}

export const initState = {
  title: '',
  job: '',
  scenarioId: '',
  scenario: '',
  viewport: '',

  referenceImage: '',
  differenceImage: '',
  testImage: '',

  scenarios: '',
  viewports: [],

  sizeMode: 'Fit'
};

const _reducer = createReducer(initState,

  on(actions.loaded, (state, action) => {

    return {
      ...state,
      ...action.payload
    }
  }),

  on(actions.changeSizeMode, (state, action) => {

    return {
      ...state,
      sizeMode: action.payload.mode
    }
  }),

  on(actions.cleanupNgrxStorage, (state, action) => {

    return initState
  })
);

export function comparerPageReducer (state, action) {

  return _reducer(state, action)
}
