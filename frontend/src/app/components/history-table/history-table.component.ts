import { Component, OnInit } from '@angular/core';

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
      width: 50,
      suppressSizeToFit: true
    }
  ];

  rowData = [
    { status: 'success', date: '2020/03/31 00:33:07', scope: 'All Scenarios' },
    { status: 'fail',    date: '2020/03/31 00:34:20', scope: 'Home Page, Login Page, Landing Page, Not Authorize Page, Configuration Page...', user: 'by John' },
    { status: 'success', date: '2020/03/31 00:35:00', scope: '404 Page', user: 'by schedule' },
    { status: 'success', date: '2020/03/31 00:33:07', scope: 'All Scenarios' },
    { status: 'fail',    date: '2020/03/31 00:34:20', scope: 'Landing Page, Not Authorize Page, Configuration Page', user: 'by John' },
    { status: 'success', date: '2020/03/31 00:35:00', scope: '404 Page', user: 'by schedule' },
    { status: 'success', date: '2020/03/31 00:35:00', scope: 'Configuration Page', user: 'by schedule' },
    { status: 'success', date: '2020/03/31 00:33:07', scope: 'All Scenarios' },
    { status: 'success', date: '2020/03/31 00:33:07', scope: 'Not Authorize Page' },
    { status: 'fail',    date: '2020/03/31 00:34:20', scope: 'Home Page, Login Page, Landing Page', user: 'by John' },
    { status: 'success', date: '2020/03/31 00:35:00', scope: '404 Page', user: 'by schedule' },
    { status: 'success', date: '2020/03/31 00:33:07', scope: 'All Scenarios' },
    { status: 'fail',    date: '2020/03/31 00:34:20', scope: 'Home Page, Login Page, Landing Page, Not Authorize Page, Configuration Page...', user: 'by John' },
    { status: 'success', date: '2020/03/31 00:35:00', scope: '404 Page', user: 'by schedule' },
    { status: 'success', date: '2020/03/31 00:33:07', scope: 'All Scenarios' },
    { status: 'fail',    date: '2020/03/31 00:34:20', scope: 'Landing Page, Not Authorize Page, Configuration Page', user: 'by John' },
    { status: 'success', date: '2020/03/31 00:35:00', scope: '404 Page', user: 'by schedule' },
    { status: 'success', date: '2020/03/31 00:35:00', scope: 'Configuration Page', user: 'by schedule' },
    { status: 'success', date: '2020/03/31 00:33:07', scope: 'All Scenarios' },
    { status: 'success', date: '2020/03/31 00:33:07', scope: 'Not Authorize Page' },
    { status: 'fail',    date: '2020/03/31 00:34:20', scope: 'Home Page, Login Page, Landing Page', user: 'by John' },
    { status: 'success', date: '2020/03/31 00:35:00', scope: '404 Page', user: 'by schedule' }
  ];

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
