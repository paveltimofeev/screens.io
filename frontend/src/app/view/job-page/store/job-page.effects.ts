import { Injectable } from '@angular/core';
import { ApiAdapterService } from 'src/app/services/api-adapter.service';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { refresh, loaded } from './job-page.actions';
import { mergeMap, map, concatMap, concatMapTo } from 'rxjs/operators';
import { forkJoin } from 'rxjs';
import { DateService } from '../../../services/date.service';
import { jobTitle } from './job-page.selectors';


@Injectable()
export class JobPageEffects {

  constructor(
    private actions$: Actions,
    private api: ApiAdapterService,
    private date: DateService
  ){}

  refresh$ = createEffect(() => this.actions$.pipe(
    ofType(refresh),
    mergeMap((action) => {


      return this.api.getHistoryRecord(action.payload.id).pipe(
        mergeMap( job => {

          return this.api.getReport(job.runId).pipe(
            map ( report => {

              return {
                type: loaded.type,
                payload: {
                  title: this.date.calendar(job.startedAt),
                  job: job,
                  report: report
                }
              }
            })
          )
        })
      );

    })
  ));
}
