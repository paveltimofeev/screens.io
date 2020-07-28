import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  refresh,
  cleanupNgrxStorage,
  approve,
  switchFullHeightMode,
  setImageMode,
  setSearchFilter,
  runFailed,
  approveAllFailedCases
} from './store/job-page.actions';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import {
  cases,
  fullHeightModeOn, imageMode,
  jobDescriptionInfo,
  jobTitle,
  isRunning,
  breadcrumbTitle,
  resultStats,
  sidebarHeaderInfo,
  viewports
} from './store/job-page.selectors';
import { NavigationService } from '../../services/navigation.service';
import { breakJobExecution } from '../../store/app-api/app-api.actions';
import { filter, take } from 'rxjs/operators';
import { apiOperationResult } from '../../store/app-api/app-api.selectors';

@Component({
  selector: 'app-job-page',
  templateUrl: './job-page.component.html',
  styleUrls: ['./job-page.component.css']
})
export class JobPageComponent implements OnInit, OnDestroy {

  jobId:string;
  title$: Observable<string>;
  isRunning$: Observable<boolean>;
  resultStats$: Observable<string>;
  breadcrumbTitle$: Observable<string>;
  cases$: Observable<any[]>;
  viewports$: Observable<string[]>;
  sidebarHeaderInfo$: Observable<any>;
  jobDescriptionInfo$: Observable<any>;

  /* DATA ACTION STATES */
  fullHeightModeOn$: Observable<boolean>;
  imageMode$: Observable<string>;

  constructor(
    private route: ActivatedRoute,
    private store: Store,
    private navigation: NavigationService
    ) { }

  ngOnInit() {

    this.jobId = this.route.snapshot.params.id;

    this.title$ = this.store.select( jobTitle );
    this.isRunning$ = this.store.select( isRunning );
    this.breadcrumbTitle$ = this.store.select( breadcrumbTitle );
    this.resultStats$ = this.store.select( resultStats );
    this.cases$ = this.store.select( cases );
    this.viewports$ = this.store.select( viewports );
    this.sidebarHeaderInfo$ = this.store.select( sidebarHeaderInfo );
    this.jobDescriptionInfo$ = this.store.select( jobDescriptionInfo );

    /* DATA ACTION STATES */
    this.fullHeightModeOn$ = this.store.select( fullHeightModeOn );
    this.imageMode$ = this.store.select( imageMode );

    this.refreshView( this.jobId )
  }

  ngOnDestroy () {
    this.cleanupView()
  }


  refreshView (id?:string) {
    this.store.dispatch( refresh( {payload:{id}} ) )
  }
  cleanupView () {
    this.store.dispatch( cleanupNgrxStorage() )
  }


  /* PAGE ACTIONS */

  runFailedHandler () {

    const payload = {jobId: this.jobId};
    this.store.dispatch( runFailed({payload}) )
  }
  approveAllFailedCasesHandler () {

    const payload = {jobId: this.jobId};
    this.store.dispatch( approveAllFailedCases({payload}) )
  }


  /* DATA ITEM ACTIONS */

  clickCardHandler (caseIndex: number) {
    this.navigation.openComparer(this.jobId, caseIndex)
  }
  clickLabelHandler (scenarioId: string) {
    this.navigation.openScenario(scenarioId)
  }
  clickApproveHandler (testCase: any, caseIndex: number) {

    this.store.dispatch(approve({payload:{
      jobId: this.jobId,
      testCase: {
        reportId: testCase.reportId,
        testCaseIndex: caseIndex
      }
      }}))
  }


  /* DATA ACTIONS */

  refreshPageHandler () {
    this.refreshView( this.jobId )
  }
  breakRunningJob_InProgress:boolean = false;
  breakRunningJobHandler () {

    this.longOp(
      () => {
        // set inprogress state
        this.breakRunningJob_InProgress = true;
      },
      (corrId) => {
        this.store.dispatch( breakJobExecution( {
          payload: {
            correlationId: corrId,
            jobId: this.jobId
        }}));
      },
      () => {
        // unset inprogress state
        this.breakRunningJob_InProgress = false;
      }
    );

  }
  longOp(before:Function, action:Function, after:any):string {

    if (before) {
      before();
    }

    let corId = `${Math.random()}`;

    this.store.pipe(
      select(apiOperationResult),
      filter(x => x.correlationId === corId),
      take(1)
    ).subscribe( res => {

      if (after) {
        after(res);
      }
    });

    if (action) {
      action(corId);
    }

    return corId;
  }

  searchCaseHandler (filter: string) {
    this.store.dispatch( setSearchFilter({payload:{filter}}) );
  }
  showDifferenceImage () {

  }
  showTestImage () {

  }
  showReferenceImage () {

  }
  groupByScenarios () {

  }
  setImageMode(mode:string) {
    this.store.dispatch( setImageMode({payload:{mode}}) )
  }
  fullHeightMode () {
    this.store.dispatch( switchFullHeightMode() )
  }
  listView () {

  }


  /* SIDEBAR FILTERS */

  showMobileFilters ($event: string) {

  }
  changeStatusFilter_Passed ($event: boolean) {

  }
  changeStatusFilter_Failed ($event: boolean) {

  }
  changeViewportsFilter ($event: string[]) {

  }
}
