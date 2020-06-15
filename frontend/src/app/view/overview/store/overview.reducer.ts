import { createReducer, on } from '@ngrx/store';
import * as actions from './overview.actions'

export interface AppState {
  overview: OverviewState
}
export interface OverviewState {
  favoriteScenarios: any[];
  recentJobs: any[];

  totalScenarios: number;
  totalViewports: number;
  viewportsLabels: string[];
  scenariosLabels: string[];
  lastRunTime: any;
  totalState: string;
  autoRefreshRun: boolean;
}

export const initState = {
  favoriteScenarios: [],
  recentJobs: [],

  totalScenarios: 0,
  totalViewports: 0,
  scenariosLabels: [],
  viewportsLabels: [],
  lastRunTime: -1,
  totalState: '',
  autoRefreshRun: true
};

const _reducer = createReducer(initState,

    on(actions.loaded, (state, action) => {

        return {
            ...state,
            ...action.payload
        }
    }),

  on(actions.loadedRecentRuns, (state, action) => {

    return {
      ...state,
      ...action.payload
    }
  }),

    on(actions.cleanupNgrxStorage, (state, action) => {

      return {
        ...initState,
        autoRefreshRun: false
      }
    })
);

export function overviewReducer (state, action) {

    return _reducer(state, action)
}
