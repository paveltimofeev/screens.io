import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { refresh } from './store/history-table.actions';
import { selectHistoryTable } from './store/history-table.selectors';
import { interval } from 'rxjs';
import { AgCellButtonComponent } from './ag-cell-button/ag-cell-button.component';

@Component({
  selector: 'app-history-table',
  templateUrl: './history-table.component.html',
  styleUrls: ['./history-table.component.css']
})
export class HistoryTableComponent implements OnInit, OnDestroy {

  _filter:{key:string, value:string};

  get filter(): {key:string, value:string} {
    return this._filter;
  }

  @Input()
  set filter (value:{key:string, value:string}) {

    this._filter = value;
    this.refresh();
  }

  refresher$: any;

  gridApi;

  private statusCellRenderer(params) {

    if (params.value === 'Passed')
      return '<i style="line-height: inherit; color: #5ed17f" class="material-icons">check_circle</i>';

    if (params.value === 'Running')
      return '<i style="line-height: inherit; color: #ced16a" class="material-icons rotate">rotate_right</i>';

    if (params.value === 'Failed')
      return '<i style="line-height: inherit; color: #cd3636" class="material-icons">cancel</i>';

    return '<i style="line-height: inherit" class="material-icons">' + params.value + '</i>';
  }

  private actionCellRenderer(params) {

    return '<i style="line-height: inherit" class="material-icons" (click)="actionClickHandler()">clear</i>'
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
    { field: 'viewports', colId:'viewports', filter: true },
    { field: 'duration', colId:'duration', filter: true },
    { headerName: 'Run by', field: 'user', sortable: true, filter: true, resizable: true },
    {
      headerName:'',
      field: 'action',
      cellRendererFramework: AgCellButtonComponent,
      //cellRenderer: this.actionCellRenderer,
      width: 60,
      suppressSizeToFit: true
    }
  ];

  jobs$;

  onGridReady(params) {

    // this.gridColumnApi = params.columnApi;
    // this.gridColumnApi.autoSizeColumns(['scope']);

    this.gridApi = params.api;
    this.gridApi.sizeColumnsToFit();
    this.gridApi.setDomLayout('autoHeight');
  }

  constructor(private store: Store) { }

  actionClickHandler (event) {

    console.log('actionClickHandler', event)
  }

  ngOnInit() {

    this.jobs$ = this.store.pipe( select(selectHistoryTable));
    this.refresh();

    this.refresher$ = interval(5000).subscribe( () => {
      this.refresh();
    })
  }

  refresh() {

    const payload = {
      filter: this._filter
    };

    this.store.dispatch( refresh({payload}) );
  }

  ngOnDestroy (): void {
    this.refresher$.unsubscribe()
  }

}
