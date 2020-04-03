import { createReducer, on } from '@ngrx/store';
import * as actions from './dashboard.actions'

export interface AppState {
  dashboard: DashboardState
}
export interface DashboardState {
  scenarios: any[]
}

export const initState = {
  error: null,
  scenarios: [],
  jobs: [],
  status: []
};

const _reducer = createReducer(initState,

  on(actions.loaded, (state, action:any) => {

    return {
      ...state,
      ...action.payload,
      error: null
    }
  }),

  on(actions.error, (state, action:any) => {

    return {
      ...state,
      error: action.payload
    }
  })

);

export function dashboardReducer (state, action) {

  return _reducer(state, action)
}
