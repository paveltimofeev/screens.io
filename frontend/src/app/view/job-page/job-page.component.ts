import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { refresh, cleanupNgrxStorage, approve } from './store/job-page.actions';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { cases, jobDescriptionInfo, jobTitle, sidebarHeaderInfo, viewports } from './store/job-page.selectors';
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

  search ($event: string) {

  }
  showDifferenceImage () {

  }
  showTestImage () {

  }
  showReferenceImage () {

  }
  listView () {

  }
  fullHeightMode () {

  }
  switchOnMouseOver () {

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
