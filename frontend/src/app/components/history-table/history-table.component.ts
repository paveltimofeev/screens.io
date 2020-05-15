import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { refresh } from './store/history-table.actions';
import { selectHistoryTable } from './store/history-table.selectors';
import { interval } from 'rxjs';
import { AgCellButtonComponent } from './ag-cell-button/ag-cell-button.component';
import { IQueryFilter } from '../../services/filters.service';
import { statusCellRenderer } from './cell-renderers/status-cell';
import { dateCellRenderer } from './cell-renderers/date-cell';

@Component({
  selector: 'app-history-table',
  templateUrl: './history-table.component.html',
  styleUrls: ['./history-table.component.css']
})
export class HistoryTableComponent implements OnInit, OnDestroy {

  _filters:IQueryFilter[];

  refresher$: any;
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
      suppressSizeToFit: true,
      cellRenderer: dateCellRenderer
    },
    { field: 'scope', colId:'scope', filter: true },
    { field: 'viewports', colId:'viewports', filter: true },
    { field: 'duration', colId:'duration', filter: true },
    { headerName: 'Run by', field: 'user', sortable: true, filter: true, resizable: true },
    {
      headerName:'',
      field: 'action',
      cellRendererFramework: AgCellButtonComponent,
      //cellRenderer: actionCellRenderer,
      width: 60,
      suppressSizeToFit: true
    }
  ];

  @Input()
  set filters (value:IQueryFilter[]) {

    this._filters = value;
    this.refresh();
  }
  get filters(): IQueryFilter[] {

    return this._filters;
  }

  @Input()
  enableAutoRefresh:boolean = false;

  actionClickHandler (event) {
    console.log('actionClickHandler', event)
  }

  onGridReady(params) {

    // this.gridColumnApi = params.columnApi;
    // this.gridColumnApi.autoSizeColumns(['scope']);

    this.gridApi = params.api;
    this.gridApi.sizeColumnsToFit();
    this.gridApi.setDomLayout('autoHeight');
  }

  refresh() {

    this.store.dispatch( refresh({
      payload: { filters: this._filters }
    }));
  }


  constructor(private store: Store) {}

  ngOnInit() {

    this.jobs$ = this.store.pipe( select(selectHistoryTable));
    this.refresh();

    if (this.enableAutoRefresh) {
      this.refresher$ = interval(5000).subscribe(this.refresh)
    }
  }

  ngOnDestroy (): void {

    if (this.refresher$) {
      this.refresher$.unsubscribe()
    }
  }
}
