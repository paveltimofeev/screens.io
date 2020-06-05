import { Component, OnDestroy, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { cleanupNgrxStorage, purgeHistory, refresh, removeFilter, setFilter } from './store/jobs.actions';
import { jobs } from './store/jobs.selectors';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-jobs',
  templateUrl: './jobs.component.html',
  styleUrls: ['./jobs.component.css']
})
export class JobsComponent implements OnInit, OnDestroy {

  jobs$: Observable<any[]>;

  constructor(
    private store: Store
  ) { }

  ngOnInit() {

    this.jobs$ = this.store.pipe(select(jobs))
    this.store.dispatch( refresh() )
  }

  ngOnDestroy () {
    this.store.dispatch( cleanupNgrxStorage() )
  }


  /* PAGE ACTIONS */

  purgeHistoryHandler () {
    this.store.dispatch( purgeHistory() )
  }


  /* DATA ACTIONS */

  refreshHandler () {
    this.store.dispatch( refresh())
  }
  searchHandler ($event: string) {

  }
  groupByScenariosHandler ($event: string) {

  }


  /* FILTER ACTIONS */

  stateFilterHandler (state: string, enable: boolean) {

    let actionData = {payload: {key: 'state', value: state}};
    this.store.dispatch( enable ? setFilter( actionData ) : removeFilter( actionData ) );
  }
  starterFilterHandler (starter: string, enable: boolean) {

    let actionData = {payload: {key: 'startedBy', value: starter}};
    this.store.dispatch( enable ? setFilter( actionData ) : removeFilter( actionData ) );
  }
  todayOnlyFilterHandler (enable: boolean) {

    let actionData = {payload: {key: 'startedToday', value: 'true'}};
    this.store.dispatch( enable ? setFilter( actionData ) : removeFilter( actionData ) );
  }
}
