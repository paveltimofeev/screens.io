import { createReducer, on } from '@ngrx/store';
import * as actions from './job-page.actions'

export interface AppState {
  jobPage: JobPageState
}
export interface JobPageState {
  title: string;
  breadcrumbTitle: string;
  resultStats: string;
  scenarios: string[];
  viewports: string[];
  startedBy: string;
  totalCases: number;
  failedCases: number;
  status: string;
  cases: any[];

  searchFilter: string;
  fullHeightModeOn: boolean;
  imageMode: string;

  isRunning: boolean;
}

export const initState = {
  title: '',
  breadcrumbTitle: '',
  resultStats: '',
  scenarios: '',
  viewports: [],
  startedBy: '',
  totalCases: 0,
  failedCases: 0,
  status: '',
  cases: [],

  searchFilter: '',
  fullHeightModeOn: false,
  imageMode: 'Test Result',

  isRunning: false
};

const _reducer = createReducer(initState,

  on(actions.loaded, (state, action) => {

    return {
      ...state,
      ...action.payload,
      isRunning: action.payload.status === 'Running'
    }
  }),

  on(actions.setSearchFilter, (state, action) => {

    return {
      ...state,
      searchFilter: (action.payload.filter || '').toLowerCase()
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
