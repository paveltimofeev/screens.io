import { createReducer, on } from '@ngrx/store';
import * as actions from './job-page.actions'

export interface AppState {
  jobPage: JobPageState
}
export interface JobPageState {
  title: string;
  scenarios: string[];
  viewports: string[];
  startedBy: string;
  totalCases: number;
  failedCases: number;
  status: string;
  cases: any[];

  fullHeightModeOn: boolean;
  imageMode: string;
}

export const initState = {
  title: '',
  scenarios: '',
  viewports: [],
  startedBy: '',
  totalCases: 0,
  failedCases: 0,
  status: '',
  cases: [],

  fullHeightModeOn: false,
  imageMode: 'Test Result'
};

const _reducer = createReducer(initState,

  on(actions.loaded, (state, action) => {

    return {
      ...state,
      ...action.payload
    }
  }),

  on(actions.switchFullHeightMode, (state, action) => {

    return {
      ...state,
      fullHeightModeOn: !state.fullHeightModeOn
    }
  }),


  on(actions.setImageMode, (state, action) => {

    return {
      ...state,
      imageMode: action.payload.mode
    }
  }),

  on(actions.cleanupNgrxStorage, (state, action) => {

    return initState
  })
);

export function jobPageReducer (state, action) {

  return _reducer(state, action)
}
