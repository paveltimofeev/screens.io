import { Component, Input, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { refresh } from './store/history-table.actions';
import { selectHistoryTable } from './store/history-table.selectors';

export interface DataSource {

  date?: 'string';
  status?: 'string';
  scope?: 'string';
  user?: 'string';
}

@Component({
  selector: 'app-history-table',
  templateUrl: './history-table.component.html',
  styleUrls: ['./history-table.component.css']
})
export class HistoryTableComponent implements OnInit {

  gridApi;

  private statusCellRenderer(params) {

    if (params.value === 'Passed')
      return '<i style="line-height: inherit; color: #5ed17f" class="material-icons">check_circle</i>';

    if (params.value === 'Running')
      return '<i style="line-height: inherit; color: #ced16a" class="material-icons">loop</i>';

    if (params.value === 'Failed')
      return '<i style="line-height: inherit; color: #cd3636" class="material-icons">cancel</i>';

    return '<i style="line-height: inherit" class="material-icons">' + params.value + '</i>';
  }

  private actionCellRenderer(params) {

    return '<i style="line-height: inherit" class="material-icons">clear</i>'
  }

  private dateCellRenderer(data) {

    return data.value ? (new Date(data.value)).toLocaleString() : '';
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
    { headerName: 'Date of Run',
      width: 250,
      field: 'date',
      sortable: true,
      suppressSizeToFit: true,
      cellRenderer: this.dateCellRenderer
    },
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
  data:DataSource[] = [];

  jobs$;

  onGridReady(params) {

    // this.gridColumnApi = params.columnApi;
    // this.gridColumnApi.autoSizeColumns(['scope']);

    this.gridApi = params.api;
    this.gridApi.sizeColumnsToFit();
    this.gridApi.setDomLayout('autoHeight');
  }

  constructor(private store: Store) { }

  ngOnInit() {

    this.jobs$ = this.store.pipe( select(selectHistoryTable));
    this.store.dispatch(refresh());
  }

}
