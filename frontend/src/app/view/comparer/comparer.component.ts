import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { NavigationService } from '../../services/navigation.service';
import { approve, cleanupNgrxStorage, refresh, runAgain } from './store/comparer.actions';
import { Observable } from 'rxjs';
import { breadcrumbsInfo, descriptionInfo, images, jobTitle, pageActionsInfo } from './store/comparer.selectors';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-comparer',
  templateUrl: './comparer.component.html',
  styleUrls: ['./comparer.component.css']
})
export class ComparerComponent implements OnInit, OnDestroy {

  jobId: string;
  testCaseIndex: number;

  title$: Observable<string>;
  descriptionInfo$: Observable<any>;
  breadcrumbsInfo$: Observable<any>;
  pageActionsInfo$: Observable<any>;
  images$: Observable<any>;


  constructor(
    private route: ActivatedRoute,
    private store: Store,
    private navigation: NavigationService
  ) {}

  ngOnInit() {

    this.title$ = this.store.select( jobTitle );
    this.descriptionInfo$ = this.store.select( descriptionInfo );
    this.breadcrumbsInfo$ = this.store.select( breadcrumbsInfo );
    this.pageActionsInfo$ = this.store.select( pageActionsInfo );
    this.images$ = this.store.select( images );

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

    this.store.dispatch( approve({ payload: {
        jobId: this.jobId,
        testCaseIndex: this.testCaseIndex
    }}) )
  }
  runAgainHandler () {

    this.store.dispatch( runAgain({ payload: {
        jobId: this.jobId,
        testCaseIndex: this.testCaseIndex
    }}) )
  }
}
