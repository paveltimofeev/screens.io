import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {

  @Input()
  viewports;

  @Input()
  scenarios;

  @Input()
  selectedScenarioLabel: string;

  @Output()
  selectScenario:EventEmitter<string> = new EventEmitter();
  @Output()
  createScenario:EventEmitter<string> = new EventEmitter();

  @Output()
  selectViewport:EventEmitter<string> = new EventEmitter();
  @Output()
  createViewport:EventEmitter<string> = new EventEmitter();

}
