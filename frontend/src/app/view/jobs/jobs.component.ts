import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import * as historyTableActions from '../../components/history-table/store/history-table.actions';

@Component({
  selector: 'app-jobs',
  templateUrl: './jobs.component.html',
  styleUrls: ['./jobs.component.css']
})
export class JobsComponent implements OnInit {

  constructor(
    private store: Store
  ) { }

  ngOnInit() {}

  /* DATA ACTIONS */

  refreshHandler () {
    this.store.dispatch( historyTableActions.refresh( {payload: {filters: []}} ))
  }
  searchHandler ($event: string) {

  }
  groupByScenariosHandler ($event: string) {

  }
}
