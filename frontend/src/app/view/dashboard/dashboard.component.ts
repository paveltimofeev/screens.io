import { Component, OnInit } from '@angular/core';

import { refresh, runOneScenario } from './store/dashboard.actions';
import { select, Store } from '@ngrx/store';
import { selectScenarios } from './store/dashboard.selectors';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  scenarios$: any;

  currentHistoryFilter:any = {};

  historyFilters: string[] = ['Show All'];
  filters:any = {
    state: ['Failed', 'Passed'],
    startedBy: ['Run by me'],
    startedSince: ['Today']
  }
  filterGetters:any = {
    startedSince: (value) => {
      return (new Date()).toISOString().split('T')[0]
    }
  }

  constructor (private store: Store) {

    Object.keys(this.filters).forEach(k => {
      this.historyFilters = this.historyFilters.concat(
        this.filters[k]
      )
    })
  }

  ngOnInit() {

    this.scenarios$ = this.store.pipe( select(selectScenarios));
    this.store.dispatch(refresh());
  }

  runOneScenarioHandler ($event: string) {
    this.store.dispatch(runOneScenario( {label: $event}));
  }

  applyFilterHandler($event:string) {

    if ($event === this.historyFilters[0]) {
      this.currentHistoryFilter = {};
    }
    else {

      Object.keys(this.filters).forEach(k => {
        if (this.filters[k].indexOf($event) >= 0) {

          let filter = {}

          let getterFunc = this.filterGetters[k]
          if (getterFunc) {
            $event = getterFunc($event)
          }

          filter[k] = this.currentHistoryFilter[k] === $event ? null : $event;

          this.currentHistoryFilter = {
            ...this.currentHistoryFilter,
            ...filter
          }

          return;
        }
      });
    }
  }
}
