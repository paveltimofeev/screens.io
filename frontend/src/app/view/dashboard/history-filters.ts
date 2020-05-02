// import { IQueryFilter, BaseFilter, MultiOptionFilter, SinceDateFilter } from '../../services/filters.service';
//
// export let HistoryFilters:IQueryFilter[] = [
//
//   new BaseFilter('state', ['Failed', 'Passed']),
//   new BaseFilter('startedBy', ['Run by me']),
//   new SinceDateFilter('startedSince', ['Today']), // This week
//   new MultiOptionFilter('viewports',  ['1600 × 900', '800 × 600'])
// ]



import { IQueryFilter } from '../../services/filters.service';

export let HistoryFilters:IQueryFilter[] = [

  { key: 'state', values: ['Failed', 'Passed'], type: 'BaseFilter', value: null },
  { key: 'startedBy', values: ['Run by me'], type: 'BaseFilter', value: null },
  { key: 'startedSince', values: ['Today'], type: 'SinceDateFilter', value: null },
  { key: 'viewports', values: ['1600 × 900', '800 × 600'], type: 'MultiOptionsFilter', value: null },
]
