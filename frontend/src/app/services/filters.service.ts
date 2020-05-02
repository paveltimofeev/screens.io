import { Injectable } from '@angular/core';

export interface IQueryFilter {

  value: string;
  key: string;
  values: string[];
  type: string;
}

export interface IFilterService {

  setValue(filter:IQueryFilter, value: string): IQueryFilter;
  toQuery(filter:IQueryFilter): string;
  clear(filter:IQueryFilter): IQueryFilter
}

export class BaseFilterService implements IFilterService {

  setValue(filter:IQueryFilter, value: string): IQueryFilter {

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
  clear(filter:IQueryFilter): IQueryFilter {

    return {
      ...filter,
      value: null
    }
  }
}

export class SinceDateFilterService extends BaseFilterService {

  setValue(filter:IQueryFilter, value: string): IQueryFilter {

    if (!filter.value && value === 'Today') {

      return {
      ...filter,
        value: (new Date()).toISOString().split('T')[0]
      }
    }
    else if (filter.value) {
      return this.clear(filter)
    }
  }
}

export class MultiOptionsFilterService extends BaseFilterService {

  setValue(filter:IQueryFilter, value: string): IQueryFilter {

    let newValue = value;

    if (filter.value && filter.value.indexOf(','+value) >= 0) {
      newValue = filter.value.replace(','+value, '')
    }
    else if (filter.value && filter.value.indexOf(value+',') >= 0) {
      newValue = filter.value.replace(value+',', '')
    }
    else if (filter.value === value) {
      return this.clear(filter)
    }
    else if (filter.value) {
      newValue = [filter.value, value].join(',')
    }
    else {
      newValue = value;
    }

    return {
      ...filter,
      value: newValue
    }
  }
}

export class BaseFilter implements IQueryFilter {

  value: string = null;
  key: string;
  values: string[];
  type: string = 'BaseFilter';

  constructor(key: string, values: string[], type:string = 'BaseFilter') {
    this.key = key;
    this.values = values;
    this.type = type;
  }
}

export class SinceDateFilter extends BaseFilter {}
export class MultiOptionFilter extends BaseFilter {}


@Injectable({
  providedIn: 'root'
})
export class FiltersService {

  BaseFilter:IFilterService = new BaseFilterService()
  SinceDateFilter:IFilterService = new SinceDateFilterService()
  MultiOptionsFilter:IFilterService = new MultiOptionsFilterService()

  toQuery (filter:IQueryFilter) {

    return this.BaseFilter.toQuery(filter)
  }

  getValues (filters:IQueryFilter[]):string[] {

    let results:string[] = []

    filters.forEach( (f:IQueryFilter) => {
      results = results.concat(f.values)
    })

    return results;
  }

  setFilter (filters:IQueryFilter[], value:string):IQueryFilter[] {


    return filters.map( (filter:IQueryFilter) => {

      if (filter.values.indexOf(value) >= 0 ) {

        if (filter.type === 'BaseFilter') {
          filter = this.BaseFilter.setValue(filter, value)
        }
        if (filter.type === 'SinceDateFilter') {
          filter = this.SinceDateFilter.setValue(filter, value)
        }
        if (filter.type === 'MultiOptionsFilter') {
          filter = this.MultiOptionsFilter.setValue(filter, value)
        }
      }

      return filter
    })
  }

  clearFilters (filters:IQueryFilter[]):IQueryFilter[] {

    return filters.map( (filter:IQueryFilter) => {
      return this.BaseFilter.clear(filter)
    })
  }
}
