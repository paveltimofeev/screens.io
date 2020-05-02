import { Component, OnInit } from '@angular/core';

import { refresh, runOneScenario } from './store/dashboard.actions';
import { select, Store } from '@ngrx/store';
import { selectScenarios } from './store/dashboard.selectors';
import { IQueryFilter, FiltersService } from '../../services/filters.service';
import { CreateHistoryFilters } from './history-filters';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  scenarios$: any;

  _historyFilters = CreateHistoryFilters()

  currentHistoryFilters:IQueryFilter[] = [];
  historyFilters: string[] = ['Show All'];

  constructor (private store: Store, private filters: FiltersService) {}

  ngOnInit() {

    this.historyFilters = [
      'Show All',
      ...this.filters.getValues(this._historyFilters)
    ]

    this.scenarios$ = this.store.pipe( select(selectScenarios))
    this.store.dispatch(refresh())
  }

  runOneScenarioHandler ($event: string) {
    this.store.dispatch(runOneScenario( {label: $event}));
  }

  applyFilterHandler($event:string) {

    if ($event === 'Show All') {
      this._historyFilters = this.filters.clearFilters(this._historyFilters)
    }
    else {
      this._historyFilters = this.filters.setFilter(this._historyFilters, $event)
    }

    this.currentHistoryFilters = this._historyFilters
  }
}
