import { createReducer, on } from '@ngrx/store';
import * as actions from './jobs.actions'
import { IJobRecord } from '../../../models/app.models';


export interface IFilter {
  key: string;
  value: string;
}

export interface AppState {
  jobs: JobsState
}

export interface JobsState {
  filters: IFilter[],
  jobs: IJobRecord[],
  latestRowStartedAt: string;
}
export const initState = {
  filters: [],
  jobs: [],
  latestRowStartedAt: null
};

const _reducer = createReducer(initState,

  on(actions.loaded, (state, action) => {

    return {
      ...state,
      ...action.payload
    }
  }),

  on(actions.loadedMore, (state, action) => {

    return {
      ...state,
      jobs: [
        ...state.jobs,
        ...action.payload.jobs
      ],
      latestRowStartedAt: action.payload.latestRowStartedAt
    }
  }),

  on(actions.setFilter, (state, action) => {

    return {
      ...state,
      filters: [
        ...state.filters,
        {
          key: action.payload.key,
          value: action.payload.value
        }
      ]
    }
  }),


  on(actions.removeFilter, (state, action) => {
    return {
      ...state,
      filters: state.filters.filter( (f:{key:string, value:string}) => {
        return !(f.key === action.payload.key && f.value === action.payload.value)
      })
    }
  }),

  on(actions.cleanupNgrxStorage, (state, action) => {
    return initState
  })
);

export function jobsReducer (state, action) {

  return _reducer(state, action)
}
