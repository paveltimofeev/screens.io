import { Component, OnInit } from '@angular/core';
import { ApiAdapterService } from '../../services/api-adapter.service';
import { map } from 'rxjs/operators';

import { refresh } from './store/dashboard.actions';
import { select, Store } from '@ngrx/store';
import { selectScenarios } from './store/dashboard.selectors';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  scenarios$: any;
  history$: any;

  constructor(
    private api: ApiAdapterService,
    private store: Store
  ) { }

  ngOnInit() {

    this.scenarios$ = this.store.pipe( select(selectScenarios));
    this.store.dispatch(refresh());

    // this.history$ = this.api.getHistory().pipe(
    //   map( x => {
    //     return x.jobs.map( j => {
    //
    //       return {
    //         date: j,
    //         status: 'success',
    //         scope: 'All scenarios',
    //         user: 'by schedule'
    //       }
    //
    //     });
    //
    //   }));
  }
}
