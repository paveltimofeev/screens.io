import { createSelector } from '@ngrx/store';
import { AppState, SidebarState } from './sidebar.reducer';

export const selectFeature = (state:AppState) => state.sidebar;

export const selectViewports = createSelector(
  selectFeature,
  (state:SidebarState) => state.viewports
);

export const selectScenarios = createSelector(
  selectFeature,
  (state:SidebarState) => state.scenarios
);

