import { Injectable } from '@angular/core';
import { ApiAdapterService } from 'src/app/services/api-adapter.service';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import {
  refresh,
  loaded,
  runAllScenarios,
  refreshRecentRuns,
  loadedRecentRuns,
  runOneScenario,
  cleanupNgrxStorage
} from './overview.actions';
import { mergeMap, map, debounceTime, filter } from 'rxjs/operators';
import { forkJoin, of } from 'rxjs';
import { DateService } from '../../../services/date.service';
import { environment } from '../../../../environments/environment';


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

  runOneScenario$ = createEffect(() => this.actions$.pipe(
    ofType(runOneScenario),
    mergeMap((data) => {

      const opts = { scenarios: [data.label] };

      return this.api.run(opts).pipe(
        map( res => {
          return {type:refresh.type};
        })
      );

    })
  ));

  refresh$ = createEffect(() => this.actions$.pipe(
    ofType(refresh),
    mergeMap(() => {

      return forkJoin(
        this.api.getScenarios(),
        this.api.getEnabledViewports(),
        this.api.getFavoriteScenarios(),
        this.api.getWidgetsData()
      ).pipe(

        map( ([scenarios, viewports, favorites, widgets]) => {

          return {
            type: loaded.type,
            payload: {

              favoriteScenarios: favorites.data.map( x => ({...x, meta_referenceSM: `${environment.media}${x.meta_referenceSM}`})),

              totalScenarios: scenarios.data.length,
              totalViewports: viewports.data.length,

              scenariosLabels: scenarios.data.map(x => x.label),
              viewportsLabels: viewports.data.map(x => x.label),

              lastRunTime: -1,
              totalState: '',

              widgets
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
        }).slice(0, 5)
      }

      return this.api.getHistoryWithFilter({key: 'not_state', value: 'Approved'})
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
    ofType(loadedRecentRuns, cleanupNgrxStorage),
    debounceTime(5000),
    filter( x => x.type === loadedRecentRuns.type),
    mergeMap((action) => {

        return of( {type: refreshRecentRuns.type} )
    })));
}
