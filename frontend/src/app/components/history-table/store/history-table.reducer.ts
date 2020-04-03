import { createReducer, on } from '@ngrx/store';
import * as actions from './history-table.actions';

export const initState = {
  jobs: []
};

const _reducer = createReducer(initState,

  on(actions.loaded, (state, action:any) => {

    return {
      ...state,
      error: null,
      jobs: action.payload
    }
  }),

  on(actions.error, (state, action:any) => {

    return {
      ...state,
      error: action.payload
    }
  })
);

export function historyTableReducer (state, action) {

  return _reducer(state, action);
}
