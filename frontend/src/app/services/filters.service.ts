import { Injectable } from '@angular/core';

export enum QueryFilterType {
  SingleOptionFilter,
  SinceDateFilter,
  MultiOptionsFilter
}

export interface IQueryFilter {

  value: string;
  key: string;
  values: string[];
  type: QueryFilterType;
}

export class QueryFilter implements IQueryFilter {

  value: string = null;
  key: string;
  values: string[];
  type: QueryFilterType;

  constructor(key: string, values: string[], type:QueryFilterType = QueryFilterType.SinceDateFilter) {

    this.key = key;
    this.values = values;
    this.type = type;
  }
}


interface IFilterService {

  setValue(filter:IQueryFilter, value: string): IQueryFilter;
  toQuery(filter:IQueryFilter): string;
  clear(filter:IQueryFilter): IQueryFilter
}


/// Creates query like: key=value
class BaseFilterService implements IFilterService {

  setValue (filter:IQueryFilter, value: string): IQueryFilter {

    if (filter.value !== value) {

      return {
        ...filter,
        value: value
      }
    }
    else {
      return this.clear(filter)
    }
  }

  toQuery (filter:IQueryFilter): string {

    if (filter.value !== null) {
      return `${filter.key}=${filter.value}`;
    }
    else {
      return ''
    }
  }

  clear (filter:IQueryFilter): IQueryFilter {

    return {
      ...filter,
      value: null
    }
  }
}

/// Creates query like: key=YYYY-MM-DD
class SinceDateFilterService extends BaseFilterService {

  readonly dayMs = 1000 * 60 * 60 * 24;

  getDaysAgo (days:number): Date {

    return new Date(Date.now() - this.dayMs * days)
  }

  // Return date in YYYY-MM-DD format
  formatDate (date: Date): string {

    return date.toISOString().split('T')[0]
  }

  setValue (filter:IQueryFilter, value: string): IQueryFilter {

    let newValue = ''

    switch (value) {
      case 'Today':
        newValue = this.formatDate( new Date() )
        break
      case 'Last 3 days':
        newValue = this.formatDate( this.getDaysAgo(3)  )
        break
      case 'Last 7 days':
        newValue = this.formatDate( this.getDaysAgo(7) )
    }

    if (filter.value === newValue) {
      return this.clear(filter)
    }
    else {

      return {
        ...filter,
        value: newValue
      }
    }
  }
}

/// Creates query like: key=val1,val2
class MultiOptionsFilterService extends BaseFilterService {

  setValue(filter:IQueryFilter, value: string): IQueryFilter {

    let newValue = value;

    if (filter.value && filter.value.indexOf( ',' + value ) >= 0) {
      newValue = filter.value.replace( ',' + value, '')
    }
    else if (filter.value && filter.value.indexOf( value + ',' ) >= 0) {
      newValue = filter.value.replace (value + ',', '')
    }
    else if (filter.value === value) {
      return this.clear(filter)
    }
    else if (filter.value) {
      newValue = [filter.value, value].join(',')
    }

    return {
      ...filter,
      value: newValue
    }
  }
}


@Injectable({
  providedIn: 'root'
})
export class FiltersService {

  QueryFilter:IFilterService = new BaseFilterService()
  SinceDateFilter:IFilterService = new SinceDateFilterService()
  MultiOptionsFilter:IFilterService = new MultiOptionsFilterService()

  getFiltersValues (filters:IQueryFilter[]):string[] {

    let results:string[] = []

    filters.forEach( (f:IQueryFilter) => {
      results = results.concat(f.values)
    })

    return results;
  }

  setFilter (filters:IQueryFilter[], value:string):IQueryFilter[] {


    return filters.map( (filter:IQueryFilter) => {

      if (filter.values.indexOf(value) >= 0 ) {

        if (filter.type === QueryFilterType.SingleOptionFilter) {
          filter = this.QueryFilter.setValue(filter, value)
        }
        if (filter.type === QueryFilterType.SinceDateFilter) {
          filter = this.SinceDateFilter.setValue(filter, value)
        }
        if (filter.type === QueryFilterType.MultiOptionsFilter) {
          filter = this.MultiOptionsFilter.setValue(filter, value)
        }
      }

      return filter
    })
  }

  clearFilters (filters:IQueryFilter[]):IQueryFilter[] {

    return filters.map( (filter:IQueryFilter) => {
      return this.QueryFilter.clear(filter)
    })
  }

  buildQuery (filter:IQueryFilter) {

    return this.QueryFilter.toQuery(filter)
  }
}
