import { IFilter, BaseFilter, MultiOptionFilter, SinceDateFilter } from '../../services/filters';

export let HistoryFilters:IFilter[] = [

  new BaseFilter('state', ['Failed', 'Passed']),
  new BaseFilter('startedBy', ['Run by me']),
  new SinceDateFilter('startedSince', ['Today']), // This week
  new MultiOptionFilter('viewports',  ['1600 × 900', '800 × 600'])
]
