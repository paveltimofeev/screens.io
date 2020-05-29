import { Injectable } from '@angular/core';
import { ApiAdapterService } from 'src/app/services/api-adapter.service';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { loaded, purgeHistory, refresh, removeFilter, setFilter } from './jobs.actions';
import { mergeMap, map, concatMap, concatMapTo, take, tap, delay, debounceTime, withLatestFrom } from 'rxjs/operators';
import { Filters } from '../../../ui-kit/widget-run/widget-run.component';
import { FiltersService, IQueryFilter, QueryFilter, QueryFilterType } from '../../../services/filters.service';
import { Observable, of } from 'rxjs';
import * as historyTableActions from '../../../components/history-table/store/history-table.actions';
import { select, Store } from '@ngrx/store';
import { filters } from './jobs.selectors';


@Injectable()
export class JobsEffects {

  filters$: Observable<any[]>;

  constructor (
    private actions$: Actions,
    private store: Store,
    private api: ApiAdapterService,
    private filtersStv: FiltersService
  ) {
    this.filters$ = this.store.pipe(select(filters));
  }

  refresh$ = createEffect(() => this.actions$.pipe(
    ofType(refresh, removeFilter, setFilter),
    withLatestFrom(this.store.select(filters)),
    mergeMap(([action, filters]) => {

      return this.api.getHistoryWithFilters(filters, 30).pipe(
        map( res => {

          return {
            type: loaded.type,
            payload: {
              jobs: res.jobs
            }
          }
        })
      );
    }
  )));

  purgeHistory$ = createEffect(() => this.actions$.pipe(
    ofType(purgeHistory),
    mergeMap((action) => {

      return of({
        type: historyTableActions.refresh.type,
        payload: {filters: []}
      })
    })));

}
