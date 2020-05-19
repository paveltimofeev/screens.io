import { createReducer, on } from '@ngrx/store';
import * as actions from './overview.actions'
import { stats } from './overview.selectors';

export interface AppState {
    overview: OverviewState
}
export interface OverviewState {
    favoriteScenarios: any[],
    recentJobs: any[],

    totalScenarios: number,
    totalViewports: number,
    lastRunTime: any,
    totalState: string
}

export const initState = {
    favoriteScenarios: [],
    recentJobs: [],

    totalScenarios: 0,
    totalViewports: 0,
    lastRunTime: -1,
    totalState: ''
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

export function overviewReducer (state, action) {

    return _reducer(state, action)
}
