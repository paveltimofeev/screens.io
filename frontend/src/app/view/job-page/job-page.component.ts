import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { refresh, cleanupNgrxStorage } from './store/job-page.actions';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { cases, jobDescriptionInfo, jobTitle, sidebarHeaderInfo, viewports } from './store/job-page.selectors';

@Component({
  selector: 'app-job-page',
  templateUrl: './job-page.component.html',
  styleUrls: ['./job-page.component.css']
})
export class JobPageComponent implements OnInit, OnDestroy {

  title$: Observable<string>;
  cases$: Observable<any[]>;
  viewports$: Observable<string[]>;
  sidebarHeaderInfo$: Observable<any>;
  jobDescriptionInfo$: Observable<any>;

  constructor(
    private route: ActivatedRoute,
    private store: Store
    ) { }

  ngOnInit() {

    this.title$ = this.store.select( jobTitle );
    this.cases$ = this.store.select( cases );
    this.viewports$ = this.store.select( viewports );
    this.sidebarHeaderInfo$ = this.store.select( sidebarHeaderInfo );
    this.jobDescriptionInfo$ = this.store.select( jobDescriptionInfo );

    this.refreshView( this.route.snapshot.params.id )
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
}
