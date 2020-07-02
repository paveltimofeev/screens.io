import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';

export class Filters {
  scenarios: string[];
  viewports: string[]
}

@Component({
  selector: 'app-widget-run',
  templateUrl: './widget-run.component.html'
})
export class WidgetRunComponent {

  filters:Filters = new Filters();

  scenariosFilter: string;
  viewportsFilter: string[];

  @Input()
  scenarios:string[];

  @Input()
  viewports:string[];

  @Input()
  isRunning: boolean;

  @Output()
  clickRunFiltered: EventEmitter<Filters> = new EventEmitter();

  scenariosFilterChanged () {

    this.filters.scenarios = this.scenarios.filter( x => x.toLowerCase().indexOf(this.scenariosFilter.toLowerCase()) > -1 )
  }

  viewportSelectionChanged (viewports) {
    this.filters.viewports = viewports;
  }

  clickRunFilteredHandler () {

    if (!this.isRunning) {
      this.clickRunFiltered.emit(this.filters);
    }
  }

  resetHandler () {
    this.filters.scenarios = [];
    this.filters.viewports = [];
    this.scenariosFilter = '';
    this.viewportsFilter = [];
  }
}
