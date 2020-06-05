import { createAction, props } from '@ngrx/store';
//import { OverviewState } from './overview.reducer';

export const refresh = createAction('[Overview Component] refresh');
export const refreshRecentRuns = createAction('[Overview Component] refreshRecentRuns');
export const loaded = createAction( '[Overview Component] loaded', props<{payload: any}>() );
export const loadedRecentRuns = createAction( '[Overview Component] loadedRecentRuns', props<{payload: any}>() );

export const cleanupNgrxStorage = createAction('[Overview Component] cleanupNgrxStorage');
export const stopAutoRefresh = createAction('[Overview Component] stopAutoRefresh');
export const autoRefreshStopped = createAction('[Overview Component] autoRefreshStopped');

export const runAllScenarios = createAction('[Overview Component] runAllScenarios');
export const runOneScenario = createAction(
  '[Dashboard Component] runOneScenario',
  props<{label:string}>()
);
