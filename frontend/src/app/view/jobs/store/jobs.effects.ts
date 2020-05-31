import { Injectable } from '@angular/core';
import { ApiAdapterService } from 'src/app/services/api-adapter.service';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { loaded, purgeHistory, refresh, removeFilter, setFilter } from './jobs.actions';
import { mergeMap, map, withLatestFrom } from 'rxjs/operators';
import { of } from 'rxjs';
import * as historyTableActions from '../../../components/history-table/store/history-table.actions';
import { Store } from '@ngrx/store';
import { filters } from './jobs.selectors';


@Injectable()
export class JobsEffects {

  constructor (
    private actions$: Actions,
    private store: Store,
    private api: ApiAdapterService
  ) {}

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

        }));}
  )));

  purgeHistory$ = createEffect(() => this.actions$.pipe(
    ofType(purgeHistory),
    mergeMap((action) => {

      return of({
        type: historyTableActions.refresh.type,
        payload: {
          filters: []
        }
      })

    })));
}
