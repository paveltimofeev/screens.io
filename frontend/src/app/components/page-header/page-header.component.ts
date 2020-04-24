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

    const label = `${parseInt((Math.random()*90+10).toString())} run all scenarios `
    console.time(label)

    this.api.run({}).subscribe( res => {

      console.timeEnd(label)
      console.log('completed', res);
    });

  }

}
