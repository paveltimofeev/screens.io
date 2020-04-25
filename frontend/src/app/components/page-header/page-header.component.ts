import { Component, OnInit } from '@angular/core';
import { ApiAdapterService } from '../../services/api-adapter.service';

@Component({
  selector: 'app-page-header',
  templateUrl: './page-header.component.html',
  styleUrls: ['./page-header.component.css']
})
export class PageHeaderComponent implements OnInit {

  constructor(private api: ApiAdapterService) { }

  ngOnInit() {}

  onClickRun() {
    this.api.run({}).subscribe( console.log);
  }

}
