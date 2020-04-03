import { createAction, props } from '@ngrx/store';

export const refresh = createAction('[Configuration] refresh');
export const error = createAction('[Configuration] error');

export const loaded = createAction(
  '[Configuration] loaded',
  props<{
    viewportsList: string[];
    scenariosList: string[];
    scenarios: any[];
  }>()
);

export const changeCurrentScenario = createAction(
  '[Configuration] changeCurrentScenario',
  props<{label:string}>()
);

export const updateScenario = createAction(
  '[Configuration] updateScenario',
  props<{data:any}>()
);

export const deleteCurrentScenario = createAction('[Configuration] deleteCurrentScenario');
