import { Component, OnInit } from '@angular/core';
import { IBarItem } from '../../ui-kit/widget-timeline/widget-timeline.component';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.css']
})
export class OverviewComponent implements OnInit {

  constructor() { }

  ngOnInit() {

    const count = Math.floor(Math.random() * 30);

    for (let i =0; i< count; i++) {

      let val = Math.floor(Math.random() * 100);

      this.weeklyPassed.push({
        percent: val,
        highlighted: val >= 80,
        tooltip: `${val}%`
      })
    }

  }

  weeklyPassed:IBarItem[] = [];

  testEventHandler(event) {
    console.log(event)
  }
}
