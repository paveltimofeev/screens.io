import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-history-table',
  templateUrl: './history-table.component.html',
  styleUrls: ['./history-table.component.css']
})
export class HistoryTableComponent implements OnInit {

  gridApi;
  gridColumnApi;

  private statusCellRenderer(params) {

    if (params.value === 'success')
      return '<i style="line-height: inherit; color: #5ed17f" class="material-icons">check_circle</i>'

    if (params.value === 'fail')
      return '<i style="line-height: inherit; color: #cd3636" class="material-icons">cancel</i>'

    return '<i style="line-height: inherit" class="material-icons">' + params.value + '</i>'
  }

  private actionCellRenderer(params) {

    return '<i style="line-height: inherit" class="material-icons">clear</i>'
  }

  columnDefs = [
    {
      headerName:'',
      field: 'status',
      sortable: true,
      filter: true,
      width: 60,
      cellRenderer: this.statusCellRenderer,
      suppressSizeToFit: true
    },
    { headerName: 'Date of Run', field: 'date', sortable: true, suppressSizeToFit: true },
    { field: 'scope', colId:'scope', filter: true },
    { headerName: 'Run by', field: 'user', sortable: true, filter: true, resizable: true },
    {
      headerName:'',
      field: 'action',
      cellRenderer: this.actionCellRenderer,
      width: 60,
      suppressSizeToFit: true
    }
  ];

  @Input()
  data:any[] = []

  onGridReady(params) {

    // this.gridColumnApi = params.columnApi;
    // this.gridColumnApi.autoSizeColumns(['scope']);

    this.gridApi = params.api;
    this.gridApi.sizeColumnsToFit();
    this.gridApi.setDomLayout('autoHeight');
  }

  constructor() { }

  ngOnInit() {
  }

}
