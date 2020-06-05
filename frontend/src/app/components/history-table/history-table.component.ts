import { Component, Input } from '@angular/core';
import { statusCellRenderer } from './cell-renderers/status-cell';

@Component({
  selector: 'app-history-table',
  templateUrl: './history-table.component.html',
  styleUrls: ['./history-table.component.css']
})
export class HistoryTableComponent {

  @Input()
  jobs$: any;

  gridApi: any;

  columnDefs = [
    {
      headerName:'',
      field: 'status',
      sortable: true,
      filter: true,
      width: 60,
      cellRenderer: statusCellRenderer,
      suppressSizeToFit: true
    },
    { headerName: 'Date of Run',
      width: 250,
      field: 'date',
      sortable: true,
      suppressSizeToFit: true
    },
    { field: 'scope', colId:'scope', filter: true },
    { field: 'viewports', colId:'viewports', filter: true },
    { field: 'duration', colId:'duration', filter: true },
    { headerName: 'Run by', field: 'user', sortable: true, filter: true, resizable: true },
  ];

  onGridReady(params) {

    this.gridApi = params.api;
    this.gridApi.sizeColumnsToFit();
    this.gridApi.setDomLayout('autoHeight');
  }

}
