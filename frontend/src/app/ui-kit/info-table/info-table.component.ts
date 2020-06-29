import { Component, EventEmitter, Input, Output } from '@angular/core';

export interface IInfoTableRow {
  label: string;
  prop: string;
  chips: boolean;
  clickable: boolean;
}
@Component({
  selector: 'app-info-table',
  templateUrl: './info-table.component.html'
})
export class InfoTableComponent {

  @Input()
  items: any;

  _labelsAndProps: IInfoTableRow[];

  @Input()
  set labelsAndProps( value: IInfoTableRow[]) {
    this._labelsAndProps = value;
  }

  @Output()
  clickOnChip:EventEmitter<{ label:string, prop:string, value: string }> = new EventEmitter();
}
