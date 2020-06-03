import { createReducer, on } from '@ngrx/store';
import * as actions from './settings.actions'
import { operationCompleted } from './settings.actions';
import { addCustomViewport } from './settings.actions';

export interface IAccountInfo {
}
export interface IViewport {
  name: string;
  width: number;
  height: number;
}

export interface AppState {
  settings: SettingsState
}
export interface SettingsState {
  accountInfo: any;
  viewports: string[];
  selectedViewports: string[];
  selectedViewportsData: IViewport[];
  customViewports: IViewport[];
  operationCorrelationId: string;
}

export const initState = {
  accountInfo: {},
  viewports: [],
  selectedViewports: [],
  selectedViewportsData: [],
  customViewports: [],
  operationCorrelationId: null
};

const wellknownViewports =  [
  { name: '2560 × 1440' , width: 2560, height: 1440, type: 'desktop' },
  { name: '1920 × 1080' , width: 1920, height: 1080, type: 'desktop' },
  { name: '1600 × 900' , width: 1600, height: 900, type: 'desktop' },
  { name: '1536 × 864' , width: 1536, height: 864, type: 'desktop' },
  { name: '1366 × 768' , width: 1366, height: 768, type: 'desktop' },
  { name: '1280 × 1024' , width: 1280, height: 1024, type: 'desktop' },
  { name: '1024 × 768', width: 1024, height: 768, type: 'desktop' },

  { name: '3200 × 1440 - Galaxy S20',  width: 3200, height: 1440 },
  { name: '2688 × 1242 - iPhone 11 Pro Max',  width: 2688, height: 1242 },
  { name: '2436 × 1125 - iPhone XS',  width: 2436, height: 1125 },
  { name: '2160 × 1080 - LG Q6',  width: 2160, height: 1080 },
  { name: '1600 × 720 - Honor 9A',  width: 1600, height: 720 },
  { name: '1520 × 720 - Xiaomi Redmi 8',  width: 1520, height: 720 },
  { name: '1440 × 720 - Honor 9S',  width: 1440, height: 720 },
  { name: '1334 × 750 - iPhone 8', width: 1334, height: 750 },

  { name: '2732 × 2048 - iPad Pro 12.9 (2020)', width: 2732, height: 2048 },
  { name: '2388 × 1668 - iPad Pro 11', width: 2388, height: 1668 },
  { name: '2160 × 1620 - iPad 10.2', width: 2160, height: 1620 },
  { name: '1920 × 1200 - Galaxy Tab A 10.1', width: 1920, height: 1200 },
  { name: '1280 ×  800 - Galaxy Tab A 8.0', width: 1280, height: 800 },
];


const _reducer = createReducer(initState,

  on(actions.loadedAccountInfo, (state, action) => {

    return {
      ...state,
      accountInfo: action.payload
    }
  }),

  on(actions.loadedViewports, (state, action) => {

    return {
      ...state,
      viewports: wellknownViewports.map(x => x.name),
      selectedViewports: action.payload.map(x => x.name),
      selectedViewportsData: wellknownViewports.filter(v => action.payload.find( x => v.name === x.name)),
    }
  }),

  on(actions.selectViewports, (state, action) => {

    return {
      ...state,
      selectedViewports: action.payload.viewports,
      selectedViewportsData: wellknownViewports.filter(v => action.payload.viewports.find( x => v.name === x)),
    }
  }),

  on(actions.addCustomViewport, (state, action) => {

    // state.customViewports.filter( (x:IViewport) => x.name === action.payload.name )

    return {
      ...state,
      customViewports: [
        ...state.customViewports,
        action.payload
      ]
    }
  }),

  on(actions.operationCompleted, (state, action) => {

    return {
      ...state,
      operationCorrelationId: action.payload.correlationId
    }
  }),

  on(actions.cleanupNgrxStorage, (state, action) => {

    return initState
  })
);

export function settingsReducer (state, action) {

  return _reducer(state, action)
}
