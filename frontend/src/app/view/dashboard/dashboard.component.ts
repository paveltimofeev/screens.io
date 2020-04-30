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
  historyFilters: string[] = ['Show All', 'Failed', 'Passed'];
  currentHistoryFilter:any = null;

  constructor(
    private store: Store
  ) { }

  ngOnInit() {

    this.scenarios$ = this.store.pipe( select(selectScenarios));
    this.store.dispatch(refresh());
  }

  runOneScenarioHandler ($event: string) {
    this.store.dispatch(runOneScenario( {label: $event}));
  }

  applyFilterHandler($event:string) {

    if ($event === this.historyFilters[0]) {
      this.currentHistoryFilter = null;
    }
    else {
      this.currentHistoryFilter = {key: 'state', value: $event};
    }
  }
}
