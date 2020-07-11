import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { NavigationService } from '../../services/navigation.service';
import {
  approve,
  changeDisplayedImageMode,
  changeSizeMode,
  cleanupNgrxStorage,
  refresh,
  runAgain
} from './store/comparer.actions';
import { Observable } from 'rxjs';
import {
  breadcrumbsInfo,
  descriptionInfo, displayedImageMode,
  images,
  jobTitle, otherViewports,
  pageActionsInfo, runScenarioInfo,
  sizeMode, viewport, canApprove
} from './store/comparer.selectors';
import { take } from 'rxjs/operators';
import { IViewport } from '../../models/app.models';

@Component({
  selector: 'app-comparer',
  templateUrl: './comparer.component.html',
  styleUrls: ['./comparer.component.css']
})
export class ComparerComponent implements OnInit, OnDestroy {

  jobId: string;
  testCaseIndex: number;

  title$: Observable<string>;
  canApprove$: Observable<boolean>;
  descriptionInfo$: Observable<any>;
  breadcrumbsInfo$: Observable<any>;
  pageActionsInfo$: Observable<any>;
  images$: Observable<any>;
  viewport$: Observable<IViewport>;

  displayedImageMode$: Observable<string>;
  sizeMode$: Observable<string>;


  constructor(
    private route: ActivatedRoute,
    private store: Store,
    private navigation: NavigationService
  ) {}

  ngOnInit() {

    this.title$ = this.store.select( jobTitle );
    this.canApprove$ = this.store.select( canApprove );
    this.descriptionInfo$ = this.store.select( descriptionInfo );
    this.breadcrumbsInfo$ = this.store.select( breadcrumbsInfo );
    this.pageActionsInfo$ = this.store.select( pageActionsInfo );
    this.images$ = this.store.select( images );
    this.viewport$ = this.store.select( viewport );

    this.displayedImageMode$ = this.store.select( displayedImageMode );
    this.sizeMode$ = this.store.select( sizeMode );

    this.route.params.subscribe( params => {

      this.jobId = params.id;
      this.testCaseIndex = +params.case;

      this.store.dispatch(refresh({payload: {
          jobId: this.jobId,
          testCaseIndex: this.testCaseIndex
        }}))
    });

  }

  ngOnDestroy () {
    this.store.dispatch(cleanupNgrxStorage())
  }

  /* PAGE ACTIONS */

  openUrlHandler () {

    this.pageActionsInfo$
      .pipe(take(1))
      .subscribe( info => { this.navigation.openExternalUrl(info.url) })
  }

  approveHandler () {

    this.store.select( runScenarioInfo )
      .pipe(take(1))
      .subscribe( (info: {reportId:string, scenario:string, viewport:string}) => {

        this.store.dispatch( approve({ payload: {
            jobId: this.jobId,
            reportId: info.reportId,
            testCaseIndex: this.testCaseIndex
          }
        }))
      })
  }

  runAgainHandler () {

    this.store.select( runScenarioInfo )
      .pipe(take(1))
      .subscribe( (info: {scenario:string, viewport:string}) => {

        this.store.dispatch( runAgain({
            payload: {
              ...info,
              jobId: this.jobId,
              testCaseIndex: this.testCaseIndex,
            }
        }))
      })
  }


  clickOnChipHandler ($event: { label: string; prop: string; value: string }) {

    if ($event.prop === 'testedOn') {

      this.store
        .select(otherViewports)
        .pipe( take(1) )
        .subscribe( (cases:any[]) => {
          const c = cases.find(x => x.viewportLabel === $event.value);
          if (c) {
            this.navigation.openComparer(this.jobId, c.caseIndex + 1)
          }
          else {
            console.warn(`Cannot find "${$event.value}" in`, cases)
          }
        })
    }
  }

  /* DATA ACTIONS */
  changeDisplayedImageModeHandler (mode:string) {
    this.store.dispatch( changeDisplayedImageMode({payload: {mode: mode}}) );
  }

  changeSizeModeHandler (mode:string) {
    this.store.dispatch( changeSizeMode({payload: {mode: mode}}) );
  }
}
