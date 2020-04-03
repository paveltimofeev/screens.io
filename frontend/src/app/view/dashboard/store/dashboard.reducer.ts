import { createReducer, on } from '@ngrx/store';
import * as actions from './dashboard.actions'

export interface AppState {
  dashboard: DashboardState
}
export interface DashboardState {
  scenarios: any[]
}

export const initState = {
  scenarios: []
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
