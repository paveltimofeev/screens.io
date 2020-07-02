import { createAction, props } from '@ngrx/store';

export const openScenarioPage = createAction('[Navigation] openScenarioPage', props<{payload:{scenarioId:string}}>());
