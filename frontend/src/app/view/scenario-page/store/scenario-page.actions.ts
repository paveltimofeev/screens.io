import { createAction, props } from '@ngrx/store';
import { IScenario } from '../../../models/app.models';

export const refresh = createAction('[Scenario Page Component] refresh', props<{payload:{id:string}}>());
export const refreshScenarioHistory = createAction('[Scenario Page Component] refreshScenarioHistory', props<{payload:{id:string}}>());
export const loaded = createAction( '[Scenario Page Component] loaded', props<{payload: IScenario}>() );
export const loadedScenarioHistory = createAction( '[Scenario Page Component] loadedScenarioHistory', props<{payload: any}>() );
export const cleanupNgrxStorage = createAction('[Scenario Page Component] cleanupNgrxStorage');

export const initNewScenario = createAction('[Scenario Page Component] initNewScenario');

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

export const createScenario = createAction(
  '[Scenario Page Component] createScenario',
  props<{ payload: { scenario:any } }>()
);

export const setScenarioProp = createAction(
  '[Scenario Page Component] setScenarioProp',
  props<{ payload: { field:string, parentField?:string, value:any, isArray?:boolean } }>()
);

export const removeScenarioArrayValue = createAction(
  '[Scenario Page Component] removeScenarioArrayValue',
  props<{ payload: { field:string, index:any } }>()
);

export const resetScenarioArrayValue = createAction(
  '[Scenario Page Component] resetScenarioArrayValue',
  props<{ payload: { field:string } }>()
);
