import { createReducer, on } from '@ngrx/store';
import * as actions from './job-page.actions'

export interface AppState {
  jobPage: JobPageState
}
export interface JobPageState {
}

export const initState = {
};

const _reducer = createReducer(initState,

  on(actions.loaded, (state, action) => {

    return {
      ...state,
      ...action.payload
    }
  }),

  on(actions.cleanupNgrxStorage, (state, action) => {

    return initState
  })
);

export function jobPageReducer (state, action) {

  return _reducer(state, action)
}
