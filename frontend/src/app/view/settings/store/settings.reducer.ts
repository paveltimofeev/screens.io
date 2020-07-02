import { createReducer, on } from '@ngrx/store';
import * as actions from './settings.actions'
import { IViewport } from '../../../models/app.models';

export interface AppState {
  settings: SettingsState
}
export interface SettingsState {

  viewports: string[];
  viewportsData: IViewport[];

  selectedViewports: string[];

  customViewports: IViewport[];
  operationResult: {
    correlationId: string,
    success: boolean,
    error?: any
  }
}

export const initState = {

  viewports: [],
  viewportsData: [],

  selectedViewports: [],

  customViewports: [],
  operationResult: {}
};

const wellknownViewports =  [
  { label: '2560 × 1440' , width: 2560, height: 1440, type: 'desktop' },
  { label: '1920 × 1080' , width: 1920, height: 1080, type: 'desktop' },
  { label: '1600 × 900' , width: 1600, height: 900, type: 'desktop' },
  { label: '1536 × 864' , width: 1536, height: 864, type: 'desktop' },
  { label: '1366 × 768' , width: 1366, height: 768, type: 'desktop' },
  { label: '1280 × 1024' , width: 1280, height: 1024, type: 'desktop' },
  { label: '1024 × 768', width: 1024, height: 768, type: 'desktop' },

  { label: '3200 × 1440 - Galaxy S20',  width: 3200, height: 1440 },
  { label: '2688 × 1242 - iPhone 11 Pro Max',  width: 2688, height: 1242 },
  { label: '2436 × 1125 - iPhone XS',  width: 2436, height: 1125 },
  { label: '2160 × 1080 - LG Q6',  width: 2160, height: 1080 },
  { label: '1600 × 720 - Honor 9A',  width: 1600, height: 720 },
  { label: '1520 × 720 - Xiaomi Redmi 8',  width: 1520, height: 720 },
  { label: '1440 × 720 - Honor 9S',  width: 1440, height: 720 },
  { label: '1334 × 750 - iPhone 8', width: 1334, height: 750 },

  { label: '2732 × 2048 - iPad Pro 12.9 (2020)', width: 2732, height: 2048 },
  { label: '2388 × 1668 - iPad Pro 11', width: 2388, height: 1668 },
  { label: '2160 × 1620 - iPad 10.2', width: 2160, height: 1620 },
  { label: '1920 × 1200 - Galaxy Tab A 10.1', width: 1920, height: 1200 },
  { label: '1280 ×  800 - Galaxy Tab A 8.0', width: 1280, height: 800 },
];


const _reducer = createReducer(initState,

  on(actions.loadedViewports, (state, action) => {

    return {
      ...state,
      viewportsData: action.payload,

      // for selector component
      viewports: action.payload.map(x => x.label),
      // for selector component
      selectedViewports: action.payload.filter(x => x.enabled === true).map(x => x.label)
    }
  }),


  on(actions.selectViewports, (state, action) => {

    let newViewportsData:IViewport[] = state.viewportsData.map( (v:IViewport) => ({
      ...v,
      enabled: !!action.payload.viewports.find( x => v.label === x)
    }));

    return {
      ...state,
      viewportsData: newViewportsData,
      selectedViewports: newViewportsData.filter(x => x.enabled === true).map(x => x.label)
    }
  }),

  on(actions.addCustomViewport, (state, action) => {

    return {
      ...state,
      viewports: [
        ...state.viewports,
        ...[action.payload.viewport.label]
      ],
      viewportsData: [
        ...state.viewportsData,
        ...[action.payload.viewport]
      ],
      selectedViewports: [
        ...state.selectedViewports,
        ...[action.payload.viewport.label]
      ]
    }
  }),

  on(actions.operationCompleted, (state, action) => {

    return {
      ...state,
      operationResult: action.payload
    }
  }),

  on(actions.cleanupNgrxStorage, (state, action) => {

    return initState
  })
);

export function settingsReducer (state, action) {

  return _reducer(state, action)
}
