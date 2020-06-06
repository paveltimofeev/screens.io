import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { refresh, cleanupNgrxStorage, approve, switchFullHeightMode, setImageMode, setSearchFilter } from './store/job-page.actions';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import {
  cases,
  fullHeightModeOn, imageMode,
  jobDescriptionInfo,
  jobTitle,
  sidebarHeaderInfo,
  viewports
} from './store/job-page.selectors';
import { NavigationService } from '../../services/navigation.service';

@Component({
  selector: 'app-job-page',
  templateUrl: './job-page.component.html',
  styleUrls: ['./job-page.component.css']
})
export class JobPageComponent implements OnInit, OnDestroy {

  jobId:string;
  title$: Observable<string>;
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

  addScenarioHandler () {

  }
  runFilteredScenariosHandler () {

  }


  /* DATA ITEM ACTIONS */

  clickCardHandler (caseIndex: number) {
    this.navigation.openComparer(this.jobId, caseIndex + 1)
  }
  clickLabelHandler (scenarioId: string) {
    this.navigation.openScenario(scenarioId)
  }
  clickApproveHandler (testCase: any) {

    this.store.dispatch(approve({payload:{
      jobId: this.jobId,
      testCase: {
        reportId: testCase.reportId,
        label: testCase.label,
        viewportLabel: testCase.viewport
      }
      }}))
  }


  /* DATA ACTIONS */

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
