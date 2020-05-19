import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { refresh, cleanupNgrxStorage } from './store/job-page.actions';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { jobTitle } from './store/job-page.selectors';

@Component({
  selector: 'app-job-page',
  templateUrl: './job-page.component.html',
  styleUrls: ['./job-page.component.css']
})
export class JobPageComponent implements OnInit, OnDestroy {

  title$:Observable<string>;

  constructor(
    private route: ActivatedRoute,
    private store: Store
    ) { }

  ngOnInit() {

    this.title$ = this.store.select( jobTitle );

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
