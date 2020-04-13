import { Injectable } from '@angular/core';
import { ApiAdapterService } from '../../../services/api-adapter.service';
import { refresh, loaded, clearRecord } from './history-table.actions'
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map, mergeMap } from 'rxjs/operators';
import { of } from 'rxjs';

@Injectable()
export class HistoryTableEffects {

  constructor(
    private api: ApiAdapterService,
    private actions$: Actions
  ) {}

  refresh$ = createEffect(() => this.actions$.pipe(
    ofType(refresh),
    mergeMap(() => {

      return this.api.getHistory().pipe(
        map( res => {

          let jobs = res.jobs.map( j => {
            return {
              _id: j._id,
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

  clearRecord$ = createEffect(() => this.actions$.pipe(
    ofType(clearRecord),
    mergeMap( (actions:any) => {

      return this.api.deleteHistoryRecord(actions.payload._id).pipe(
        map( res => {

          return { type: refresh.type }
        })
      )
    })
  ));

}
