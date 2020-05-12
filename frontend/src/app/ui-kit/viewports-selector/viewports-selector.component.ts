import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Filters } from '../widget-run/widget-run.component';

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

  _viewports: ViewportItem[];

  @Input()
  set viewports(value: string[]) {

    this._viewports = value.map(v =>
      ({
        data: v,
        label: v.replace(/\s/g, ''),
        checked: false
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
