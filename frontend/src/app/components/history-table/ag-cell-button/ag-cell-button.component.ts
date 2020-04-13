import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { clearRecord } from '../store/history-table.actions';

@Component({
  selector: 'app-ag-cell-button',
  templateUrl: './ag-cell-button.component.html',
  styleUrls: ['./ag-cell-button.component.css']
})
export class AgCellButtonComponent {

  data: any;
  params: any;

  constructor(private store: Store) {}

  agInit(params) {

    this.params = params;
    this.data = params.value;
  }

  editRow() {

    let rowData = this.params;
    let i = rowData.rowIndex;
  }

  viewRow() {
    let rowData = this.params;
  }

  actionClickHandler () {

    this.store.dispatch(clearRecord({payload:this.params.data}))
  }
}
