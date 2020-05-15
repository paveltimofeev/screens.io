import { Injectable } from '@angular/core';
import { ApiAdapterService } from '../../../services/api-adapter.service';
import { refresh, loaded, clearRecord } from './history-table.actions'
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { debounceTime, map, mergeMap } from 'rxjs/operators';
import { of } from 'rxjs';

@Injectable()
export class HistoryTableEffects {

  constructor(
    private api: ApiAdapterService,
    private actions$: Actions
  ) {}

  refresh$ = createEffect(() => this.actions$.pipe(
    ofType(refresh),
    //debounceTime(1000),
    mergeMap((action) => {

      return this.api.getHistory( action.payload.filters, 1000 ).pipe(
        map( res => {

          let jobs = res.jobs.map( j => {
            return {
              _id: j._id,
              runId: j.runId,
              date: j.startedAt,
              duration: j.finishedAt && j.startedAt ? `${((new Date(j.finishedAt) as any) - (new Date(j.startedAt) as any)) / 1000} sec` : 'running...',
              status: j.state,
              scope: (j.scenarios||[]).map( (x:any) => x.label).join(', '),
              viewports: (j.viewports||[]).join(', '),
              user: `by ${j.startedBy}`
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
