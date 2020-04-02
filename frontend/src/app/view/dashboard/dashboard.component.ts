import { Component, OnInit } from '@angular/core';
import { ApiAdapterService } from '../../services/api-adapter.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  config$:any;
  history$:any;

  constructor(private api: ApiAdapterService) { }

  ngOnInit() {

    this.config$ = this.api.getConfig();
    this.history$ = this.api.getHistory().pipe(
      map( x => {
        return x.jobs.map( j => {

          return {
            date: j,
            status: 'success',
            scope: 'All scenarios',
            user: 'by schedule'
          }

        });

      }));
  }
}
