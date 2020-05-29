import { Injectable } from '@angular/core';
import { ApiAdapterService } from 'src/app/services/api-adapter.service';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import {
  refresh,
  loaded,
  runAllScenarios,
  refreshRecentRuns,
  loadedRecentRuns,
  stopAutoRefresh, autoRefreshStopped
} from './overview.actions';
import { mergeMap, map, debounceTime } from 'rxjs/operators';
import { forkJoin, of } from 'rxjs';
import { DateService } from '../../../services/date.service';
import { environment } from '../../../../environments/environment';
import { loadedScenarioHistory, refreshScenarioHistory } from '../../scenario-page/store/scenario-page.actions';


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

      return this.api.getFavoriteScenarios()
        .pipe(

        map( res => {
          return { type: loaded.type, payload: {

              //scenarios: res.data
              favoriteScenarios: res.data.map( x => ({...x, meta_referenceImageUrl: `${environment.media}${x.meta_referenceImageUrl}`})),

              totalScenarios: 0,
              totalViewports: 0,
              lastRunTime: -1,
              totalState: ''
            }}
        })
      )
    })
  ));

  refreshRecentRuns$ = createEffect(() => this.actions$.pipe(
    ofType(refreshRecentRuns),
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

      return this.api.getHistoryWithFilter({key: 'not_state', value: 'Approved'}, 5)
        .pipe(
          map( res => ({
              type: loadedRecentRuns.type,
              payload: {
                recentJobs: jobsAdapter(res.jobs)
              }
            })
        )
      )
    })
  ));

  autoRefreshRecentRuns$ = createEffect(() => this.actions$.pipe(
    ofType(loadedRecentRuns),
    debounceTime(5000),
    mergeMap((action) => {

        return of( {type: refreshRecentRuns.type} )
    })));
}
