import { createAction, props } from '@ngrx/store';

export const refresh = createAction('[Scenario Page Component] refresh', props<{payload:{id:string}}>());
export const refreshScenarioHistory = createAction('[Scenario Page Component] refreshScenarioHistory', props<{payload:{id:string}}>());
export const loaded = createAction( '[Scenario Page Component] loaded', props<{payload: any}>() );
export const loadedScenarioHistory = createAction( '[Scenario Page Component] loadedScenarioHistory', props<{payload: any}>() );
export const cleanupNgrxStorage = createAction('[Scenario Page Component] cleanupNgrxStorage');

export const cloneScenario = createAction(
  '[Scenario Page Component] cloneScenario',
  props<{ payload: { id:string } }>()
);

export const deleteScenario = createAction(
  '[Scenario Page Component] deleteScenario',
  props<{ payload: { id:string } }>()
);

export const runScenario = createAction(
  '[Scenario Page Component] runScenario',
  props<{ payload: { id:string, label:string } }>()
);

export const saveScenario = createAction(
  '[Scenario Page Component] saveScenario',
  props<{ payload: { scenario:any } }>()
);
