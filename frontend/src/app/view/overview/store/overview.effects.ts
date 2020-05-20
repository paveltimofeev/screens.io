import { Injectable } from '@angular/core';
import { ApiAdapterService } from 'src/app/services/api-adapter.service';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { refresh, loaded, runAllScenarios } from './overview.actions';
import { mergeMap, map } from 'rxjs/operators';
import { forkJoin } from 'rxjs';
import { DateService } from '../../../services/date.service';


@Injectable()
export class OverviewEffects {

  constructor(
    private actions$: Actions,
    private api: ApiAdapterService,
    private date: DateService
  ){}

  runAllScenarios$ = createEffect(() => this.actions$.pipe(
    ofType(runAllScenarios),
    mergeMap(() => {

      return this.api.run({})
        .pipe(
          map( res => ({ type: refresh.type }) )
        )
    })
  ));

  refresh$ = createEffect(() => this.actions$.pipe(
    ofType(refresh),
    mergeMap(() => {

        const jobsAdapter = (jobs:any[]) => {

            return jobs.map( job => {

                return {
                    ...job,
                    scenarios: job.scenarios.map( (s:any) => s.label ),
                    startedDateLabel: this.date.fromNow(job.startedAt),
                    startedDate: this.date.calendar(job.startedAt),
                    upic: job.startedBy && job.startedBy.length > 0 ? job.startedBy[0] : ' '
                }
            })
        }

        return forkJoin(
            this.api.getFavoriteScenarios(),
            this.api.getHistory(null, 5)
        ).pipe(


        map( res => {
          return { type: loaded.type, payload: {

              //scenarios: res.data
              favoriteScenarios: res[0].data,
              recentJobs: jobsAdapter(res[1].jobs),

              totalScenarios: 0,
              totalViewports: 0,
              lastRunTime: -1,
              totalState: ''
            }}
        })
      )
    })
  ));
}
