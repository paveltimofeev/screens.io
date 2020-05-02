import { IQueryFilter, QueryFilter, QueryFilterType } from '../../services/filters.service';

export const CreateHistoryFilters = (): IQueryFilter[] => {

  return [

    new QueryFilter('state', ['Failed', 'Passed'], QueryFilterType.SingleOptionFilter),
    new QueryFilter('startedBy', ['Run by me'], QueryFilterType.SingleOptionFilter),
    new QueryFilter('startedSince', ['Today', 'Last 3 days', 'Last 7 days'], QueryFilterType.SinceDateFilter),
    new QueryFilter('viewports',  ['1600 × 900', '800 × 600'], QueryFilterType.MultiOptionsFilter)
  ]
}
