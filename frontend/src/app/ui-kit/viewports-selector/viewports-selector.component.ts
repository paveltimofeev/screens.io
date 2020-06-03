import { Component, EventEmitter, Input, Output } from '@angular/core';

export class ViewportItem {
  data:string;
  label:string;
  checked:boolean;
}

@Component({
  selector: 'app-viewports-selector',
  templateUrl: './viewports-selector.component.html'
})
export class ViewportsSelectorComponent {

  _selected: string[] = [];
  _viewports: ViewportItem[] = [];

  @Input()
  set selected(value:string[]){

    this._selected = value||[];

    this._viewports.forEach( (x:ViewportItem) => {
      x.checked = this._selected.indexOf(x.label) > -1
    })
  }

  @Input()
  set viewports(value: string[]) {

    this._viewports = value.map(v =>
      ({
        data: v,
        label: v,
        checked: this._selected.indexOf(v) > -1
      }))
  }

  @Output()
  selectionChanged: EventEmitter<string[]> = new EventEmitter();

  viewportClickHandler (viewport) {

    viewport.checked = !viewport.checked;

    let selectedViewports = this._viewports
      .filter(v => v.checked)
      .map(v => v.data);

    this.selectionChanged.emit( selectedViewports )
  }
}
