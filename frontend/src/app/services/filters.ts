import { Injectable } from '@angular/core';

export interface IFilter {

  _value:string;
  key: string;
  values: string[];
  setValue(value: string): void;
  toQuery(): string;
  clear(): void
}

export class BaseFilter implements IFilter {

  _value: string = null;
  key: string;
  values: string[];

  setValue(value: string) :void {

    if (this._value !== value) {
      this._value = value;
    }
    else {
      this.clear()
    }
  }
  toQuery (): string {

    if (this._value !== null) {
      return `${this.key}=${this._value}`;
    }
    else {
      return ''
    }
  }
  clear(): void {
    this._value = null;
  }

  constructor(key: string, values: string[]) {
    this.key = key;
    this.values = values;
  }
}

export class SinceDateFilter extends BaseFilter {

  setValue(value: string) {

    if (!this._value && value === 'Today') {
      this._value = (new Date()).toISOString().split('T')[0]
    }
    else if (this._value) {
      this._value = null;
    }
  }
}

export class MultiOptionFilter extends BaseFilter {

  setValue(value: string) {

    if (this._value && this._value.indexOf(','+value) >= 0) {
      this._value = this._value.replace(','+value, '')
    }
    else if (this._value && this._value.indexOf(value+',') >= 0) {
      this._value = this._value.replace(value+',', '')
    }
    else if (this._value === value) {
      this._value = null
    }
    else if (this._value) {
      this._value = [this._value, value].join(',')
    }
    else {
      this._value = value;
    }
  }
}


@Injectable({
  providedIn: 'root'
})
export class FiltersService {

  getValues (filters:IFilter[]):string[] {

    let results:string[] = []

    filters.forEach( (f:IFilter) => {
      results = results.concat(f.values)
    })

    return results;
  }

  setFilter (filters:IFilter[], value:string) {

    filters.forEach( (filter:IFilter) => {

      if (filter.values.indexOf(value) >= 0 ) {

        filter.setValue(value);
        console.log(filter.key, filter.toQuery())
        return;
      }
    })
  }

  clearFilters (filters:IFilter[]) {

    filters.forEach( (filter:IFilter) => {
      filter.clear()
    })
  }
}
