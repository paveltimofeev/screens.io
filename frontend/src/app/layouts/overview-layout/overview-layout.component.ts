import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-overview-layout',
  templateUrl: './overview-layout.component.html',
  styleUrls: ['./overview-layout.component.css']
})
export class OverviewLayoutComponent {

  @Output()
  clickRunAll:EventEmitter<any> = new EventEmitter();

  constructor() { }
}
