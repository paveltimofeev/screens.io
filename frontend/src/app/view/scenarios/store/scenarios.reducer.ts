import { createReducer, on } from '@ngrx/store';
import * as actions from './scenarios.actions'


export interface IFilter {
  key: string;
  value: string;
}

export interface AppState {
  scenarios: ScenariosState
}

export interface ScenariosState {
  filters: IFilter[];
  searchFilter: string;
  scenariosList: any[];
  viewportsList: any[];
  fullHeightModeOn: boolean;
}
export const initState = {
  filters: [],
  searchFilter: '',
  scenariosList: [],
  viewportsList: [],
  fullHeightModeOn: false
};

const _reducer = createReducer(initState,

  on(actions.loaded, (state, action) => {

    return {
      ...state,
      ...action.payload
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

export function scenariosReducer (state, action) {

  return _reducer(state, action)
}
