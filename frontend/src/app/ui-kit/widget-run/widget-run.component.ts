import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';

export class Filters {
  scenariosFilter:string;
  viewports:string[]
}

@Component({
  selector: 'app-widget-run',
  templateUrl: './widget-run.component.html'
})
export class WidgetRunComponent {

  filters:Filters = new Filters();

  @ViewChild('scenariosFilter')
  scenariosFilter:ElementRef;

  @Input()
  viewports;

  @Output()
  clickRunFiltered: EventEmitter<Filters> = new EventEmitter();


  viewportSelectionChanged (viewports) {

    this.filters.viewports = viewports;
  }

  clickRunFilteredHandler () {

    this.filters.scenariosFilter = this.scenariosFilter.nativeElement.value;
    this.clickRunFiltered.emit(this.filters);
  }
}
