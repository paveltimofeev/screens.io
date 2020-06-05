import { Injectable } from '@angular/core';
import { ApiAdapterService } from 'src/app/services/api-adapter.service';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { loaded, purgeHistory, refresh, removeFilter, setFilter } from './jobs.actions';
import { mergeMap, map, withLatestFrom } from 'rxjs/operators';
import { of } from 'rxjs';
import { Store } from '@ngrx/store';
import { filters } from './jobs.selectors';
import { DateService } from 'src/app/services/date.service';


@Injectable()
export class JobsEffects {

  constructor (
    private actions$: Actions,
    private store: Store,
    private date: DateService,
    private api: ApiAdapterService
  ) {}

  refresh$ = createEffect(() => this.actions$.pipe(
    ofType(refresh, removeFilter, setFilter),
    withLatestFrom(this.store.select(filters)),
    mergeMap(([action, filters]) => {

      return this.api.getHistoryWithFilters(filters, 30).pipe(
        map( res => {

          const jobsAdapter = (jobs:any[]) => {
            return jobs.map( j => ({
              _id: j._id,
              runId: j.runId,
              date: this.date.calendar(j.startedAt),
              duration: j.finishedAt && j.startedAt ? `${((new Date(j.finishedAt) as any) - (new Date(j.startedAt) as any)) / 1000} sec` : 'running...',
              status: j.state,
              scope: (j.scenarios||[]).map( (x:any) => x.label).join(', '),
              viewports: (j.viewports||[]).join(', '),
              user: `by ${j.startedBy}`
            }));
          }

          return {
            type: loaded.type,
            payload: {
              jobs: jobsAdapter(res.jobs)
            }
          }

        }));}
  )));

  purgeHistory$ = createEffect(() => this.actions$.pipe(
    ofType(purgeHistory),
    mergeMap((action) => {

      return of({
        type: refresh.type,
        payload: {}
      })

    })));
}
