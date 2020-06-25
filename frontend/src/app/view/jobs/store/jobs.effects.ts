import { Injectable } from '@angular/core';
import { ApiAdapterService } from 'src/app/services/api-adapter.service';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { loaded, loadedMore, loadMore, purgeHistory, refresh, removeFilter, setFilter } from './jobs.actions';
import { mergeMap, map, withLatestFrom } from 'rxjs/operators';
import { of } from 'rxjs';
import { Store } from '@ngrx/store';
import { filters, loadMoreOpts } from './jobs.selectors';
import { DateService } from 'src/app/services/date.service';
import { IJobRecord } from '../../../models/app.models';


@Injectable()
export class JobsEffects {

  constructor (
    private actions$: Actions,
    private store: Store,
    private date: DateService,
    private api: ApiAdapterService
  ) {}

  jobsAdapter = (jobs:any[]): IJobRecord[] => {
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

  loadMore$ = createEffect(() => this.actions$.pipe(
    ofType(loadMore),
    withLatestFrom(this.store.select(loadMoreOpts)),
    mergeMap(([action, loadMoreOpts]) => {

      console.log('Load more since', loadMoreOpts);

      const fromStartedAtFilter = {
        key: 'beforeStartedAt',
        value: loadMoreOpts.latestRowStartedAt
      };

      return this.api
        .getHistoryWithFilters([
          ...loadMoreOpts.filters,
          ...[fromStartedAtFilter]
        ])
        .pipe(
        map( res => {

          return {
            type: loadedMore.type,
            payload: {
              jobs: this.jobsAdapter(res.jobs),
              latestRowStartedAt: res.jobs[res.jobs.length-1].startedAt
            }
          }
        }));
    })));

   refresh$ = createEffect(() => this.actions$.pipe(
    ofType(refresh, removeFilter, setFilter),
    withLatestFrom(this.store.select(filters)),
    mergeMap(([action, filters]) => {

      return this.api.getHistoryWithFilters(filters).pipe(
        map( res => {

          return {
            type: loaded.type,
            payload: {
              jobs: this.jobsAdapter(res.jobs),
              latestRowStartedAt: res.jobs[res.jobs.length-1].startedAt
            }
          }

        }));}
  )));

  purgeHistory$ = createEffect(() => this.actions$.pipe(
    ofType(purgeHistory),
    mergeMap((action) => {

      return this.api.deleteAllHistoryRecords()
        .pipe(
          map( (res) => {

            console.log(res);
            return { type: refresh.type }
          })
        );

    })));
}
