import { Component, Input } from '@angular/core';

export interface IInfoTableRow {
  label: string;
  prop: string;
  chips: boolean;
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

}
