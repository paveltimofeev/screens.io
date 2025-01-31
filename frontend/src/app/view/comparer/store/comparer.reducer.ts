import { createReducer, on } from '@ngrx/store';
import * as actions from './comparer.actions'
import { IViewport } from '../../../models/app.models';

export interface AppState {
  comparer: ComparerState
}
export interface ComparerState {
  title: string;
  job: string;
  reportId: string;
  scenarioId: string;
  scenario: string;
  viewport: IViewport;
  url: string;
  canApprove: boolean;

  referenceImage: string;
  differenceImage: string;
  testImage: string;

  scenarios: string;
  viewports: string[];
  otherViewports: {viewportLabel: string, caseIndex:number}[];

  displayedImageMode: string;
  sizeMode: string;
}

export const initState = {
  title: '',
  job: '',
  reportId: '',
  scenarioId: '',
  scenario: '',
  viewport: {},
  canApprove: false,

  referenceImage: '',
  differenceImage: '',
  testImage: '',

  scenarios: '',
  viewports: [],
  otherViewports: [],

  displayedImageMode: '',
  sizeMode: 'Fit'
};

const _reducer = createReducer(initState,

  on(actions.loaded, (state, action) => {

    return {
      ...state,
      ...action.payload,
      displayedImageMode: action.payload.differenceImage ? 'Difference' : 'Test Result'
    }
  }),

  on(actions.changeDisplayedImageMode, (state, action) => {

    return {
      ...state,
      displayedImageMode: action.payload.mode
    }
  }),

  on(actions.changeSizeMode, (state, action) => {

    return {
      ...state,
      sizeMode: action.payload.mode
    }
  }),

  on(actions.cleanupNgrxStorage, (state, action) => {

    return initState
  })
)

export function comparerPageReducer (state, action) {

  return _reducer(state, action)
}
