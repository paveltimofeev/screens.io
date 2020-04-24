import { Component, OnInit } from '@angular/core';
import { ApiAdapterService } from '../../services/api-adapter.service';

@Component({
  selector: 'app-page-header',
  templateUrl: './page-header.component.html',
  styleUrls: ['./page-header.component.css']
})
export class PageHeaderComponent implements OnInit {

  constructor(private api: ApiAdapterService) { }

  ngOnInit() {
  }

  onClickRun() {

    console.log('run...');
    console.time('run all scenarios')
    this.api.run({}).subscribe( res => {

      console.timeEnd('run all scenarios')
      console.log('completed', res);
    });

  }

}
