import { createSelector } from '@ngrx/store';
import { AppState, ComparerState } from './comparer.reducer';

export const selectFeature = (state:AppState) => state.comparer;

export const jobTitle = createSelector(
  selectFeature,
  (state: ComparerState) => state.title
);

export const breadcrumbsInfo = createSelector(
  selectFeature,
  (state: ComparerState) => ({
    job: state.job,
    scenarioId: state.scenarioId,
    scenario: state.scenario,
    viewport: state.viewport
  })
);

export const descriptionInfo = createSelector(
  selectFeature,
  (state: ComparerState) => ({
    testedOn: state.viewports,
    testedWith: state.scenarios
  })
);

export const pageActionsInfo = createSelector(
  selectFeature,
  (state: ComparerState) => ({
    url: state.url,
    scenarioId: state.scenarioId
  })
);

export const images = createSelector(
  selectFeature,
  (state: ComparerState) => ({
    referenceImage: state.referenceImage,
    differenceImage: state.differenceImage,
    testImage: state.testImage,
  })
);

export const sizeMode = createSelector(
  selectFeature,
  (state: ComparerState) => state.sizeMode
);
