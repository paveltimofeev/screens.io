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

  @ViewChild('scenariosFilter')
  scenariosFilter:ElementRef;

  _viewports:{
    data:string,
    label:string,
    checked:boolean
  }[];

  @Input()
  set viewports(value: string[]) {

    this._viewports = value.map(v =>
      ({
        data: v,
        label: v.replace(/\s/g, ''),
        checked: false
      }))
  }

  viewportClickHandler (viewport) {
    viewport.checked = !viewport.checked;
  }

  @Output()
  clickRunFiltered: EventEmitter<Filters> = new EventEmitter();

  clickRunFilteredHandler () {

    let filters:Filters = new Filters();
    filters.scenariosFilter = this.scenariosFilter.nativeElement.value;
    filters.viewports = this._viewports.filter(v => v.checked).map(v => v.data);
    this.clickRunFiltered.emit(filters);
  }
}
