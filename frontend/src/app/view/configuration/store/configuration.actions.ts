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
  props<{scenario:any}>()
);

export const updateScenario = createAction(
  '[Configuration] updateScenario',
  props<{payload:any}>()
);

export const cloneCurrentScenario = createAction(
  '[Configuration] cloneCurrentScenario'
);

export const createScenario = createAction(
  '[Configuration] createScenario',
  props<{payload:any}>()
);
export const createViewport = createAction(
  '[Configuration] createViewport',
  props<{data:{width:number, height:number}}>()
);
export const deleteViewport = createAction(
  '[Configuration] deleteViewport',
  props<{label:string}>()
);

export const deleteCurrentScenario = createAction('[Configuration] deleteCurrentScenario');
