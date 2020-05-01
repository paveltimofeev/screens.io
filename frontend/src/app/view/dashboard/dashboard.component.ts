import { Component, OnInit } from '@angular/core';

import { refresh, runOneScenario } from './store/dashboard.actions';
import { select, Store } from '@ngrx/store';
import { selectScenarios } from './store/dashboard.selectors';
import { IFilter, FiltersService } from '../../services/filters';
import { HistoryFilters } from './history-filters';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  scenarios$: any;

  currentHistoryFilters:IFilter[] = [];
  historyFilters: string[] = ['Show All'];

  constructor (private store: Store, private filters: FiltersService) {}

  ngOnInit() {

    this.historyFilters = [
      'Show All',
      ...this.filters.getValues(HistoryFilters)
    ]

    this.scenarios$ = this.store.pipe( select(selectScenarios))
    this.store.dispatch(refresh())
  }

  runOneScenarioHandler ($event: string) {
    this.store.dispatch(runOneScenario( {label: $event}));
  }

  applyFilterHandler($event:string) {

    if ($event === 'Show All') {
      this.filters.clearFilters(HistoryFilters)
    }
    else {
      this.filters.setFilter(HistoryFilters, $event)
    }

    this.currentHistoryFilters = HistoryFilters
  }
}
