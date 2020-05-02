import { Injectable } from '@angular/core';

export interface IQueryFilter {

  value: string;
  key: string;
  values: string[];
  type: string;

  setValue(value: string): void;
  toQuery(): string;
  clear(): void
}

export class BaseFilter implements IQueryFilter {

  value: string = null;
  key: string;
  values: string[];
  type: string = 'BaseFilter';

  setValue(value: string) :void {

    if (this.value !== value) {
      this.value = value;
    }
    else {
      this.clear()
    }
  }
  toQuery (): string {

    if (this.value !== null) {
      return `${this.key}=${this.value}`;
    }
    else {
      return ''
    }
  }
  clear(): void {
    this.value = null;
  }

  constructor(key: string, values: string[], type:string = 'BaseFilter') {
    this.key = key;
    this.values = values;
    this.type = type;
  }
}

export class SinceDateFilter extends BaseFilter {

  setValue(value: string) {

    if (!this.value && value === 'Today') {
      this.value = (new Date()).toISOString().split('T')[0]
    }
    else if (this.value) {
      this.value = null;
    }
  }
}

export class MultiOptionFilter extends BaseFilter {

  setValue(value: string) {

    if (this.value && this.value.indexOf(','+value) >= 0) {
      this.value = this.value.replace(','+value, '')
    }
    else if (this.value && this.value.indexOf(value+',') >= 0) {
      this.value = this.value.replace(value+',', '')
    }
    else if (this.value === value) {
      this.value = null
    }
    else if (this.value) {
      this.value = [this.value, value].join(',')
    }
    else {
      this.value = value;
    }
  }
}


@Injectable({
  providedIn: 'root'
})
export class FiltersService {

  getValues (filters:IQueryFilter[]):string[] {

    let results:string[] = []

    filters.forEach( (f:IQueryFilter) => {
      results = results.concat(f.values)
    })

    return results;
  }

  setFilter (filters:IQueryFilter[], value:string) {

    filters.forEach( (filter:IQueryFilter) => {

      if (filter.values.indexOf(value) >= 0 ) {

        console.log(filter.key, filter.type, value)
        filter.setValue(value);
        console.log(filter.key, filter.type, filter.toQuery())
        return;
      }
    })
  }

  clearFilters (filters:IQueryFilter[]) {

    filters.forEach( (filter:IQueryFilter) => {
      filter.clear()
    })
  }
}
