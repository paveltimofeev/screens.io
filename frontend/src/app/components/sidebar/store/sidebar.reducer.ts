import { createReducer, on } from '@ngrx/store';
import * as actions from './sidebar.actions';

export interface SidebarState {
  viewports: any[];
  scenarios: any[];
}
export interface AppState {
  sidebar: SidebarState
}
export const initState = {
  viewports: [],
  scenarios: []
}

const _reducer = createReducer(initState,
  on(actions.loaded, (state, actions:any) => {
    return {
      ...state,
      ...actions.payload,
      error: null
    }
  }),

  on(actions.error, (state, actions:any) => {
    return {
      ...state,
      error: actions.payload
    }
  })
);

export function sidebarReducer (state, action) {
  return _reducer(state, action)
}
