import { Component, OnDestroy, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { cleanupNgrxStorage, loadMore, purgeHistory, refresh, removeFilter, setFilter } from './store/jobs.actions';
import { jobs, loadingMoreInProgress, noMoreRecords, total } from './store/jobs.selectors';
import { Observable } from 'rxjs';
import { NavigationService } from 'src/app/services/navigation.service';

@Component({
  selector: 'app-jobs',
  templateUrl: './jobs.component.html',
  styleUrls: ['./jobs.component.css']
})
export class JobsComponent implements OnInit, OnDestroy {

  jobs$: Observable<any[]>;
  total$: Observable<number>;
  noMoreRecords$: Observable<boolean>;
  loadingMoreInProgress$: Observable<boolean>;

  constructor(
    private store: Store,
    private navigate: NavigationService
  ) { }

  ngOnInit() {

    this.jobs$ = this.store.pipe(select(jobs))
    this.total$ = this.store.pipe(select(total))
    this.noMoreRecords$ = this.store.pipe(select(noMoreRecords))
    this.loadingMoreInProgress$ = this.store.pipe(select(loadingMoreInProgress))

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


  /* DATA GRID */

  clickOnRowHandler (job:any) {

    const hasReport = !!job.runId && job.status != "Approved";
    if (!!job._id && hasReport) {
      this.navigate.openJob(job._id);
    }
  }

  loadMoreHandler () {
    this.store.dispatch(loadMore())
  }
}
