import { Component, OnInit } from '@angular/core';

import { refresh } from './store/dashboard.actions';
import { select, Store } from '@ngrx/store';
import { selectScenarios } from './store/dashboard.selectors';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  scenarios$: any;

  constructor(
    private store: Store
  ) { }

  ngOnInit() {

    this.scenarios$ = this.store.pipe( select(selectScenarios));
    this.store.dispatch(refresh());
  }
}
