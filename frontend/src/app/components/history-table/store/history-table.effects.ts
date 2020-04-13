import { Injectable } from '@angular/core';
import { ApiAdapterService } from '../../../services/api-adapter.service';
import { refresh, loaded } from './history-table.actions'
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map, mergeMap } from 'rxjs/operators';

@Injectable()
export class HistoryTableEffects {

  constructor(
    private api: ApiAdapterService,
    private actions$: Actions
  ) {}

  $refresh = createEffect(() => this.actions$.pipe(
    ofType(refresh),
    mergeMap(() => {

      return this.api.getHistory().pipe(
        map( res => {

          let jobs = res.jobs.map( j => {
            return {
              runId: j.runId,
              date: j.startedAt,
              status: j.state,
              scope: (j.scenarios||[]).join(', '),
              user: 'by schedule'
            }
          });

          return { type: loaded.type, payload: jobs}
        }))
    })
  ));

}
