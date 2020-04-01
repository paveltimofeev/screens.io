import { Component, OnInit } from '@angular/core';
import { of } from 'rxjs';
import { ApiAdapterService } from '../../services/api-adapter.service';

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
    this.history$ = this.api.getHistory();
  }
}
