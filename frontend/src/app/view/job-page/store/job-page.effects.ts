import { Injectable } from '@angular/core';
import { ApiAdapterService } from 'src/app/services/api-adapter.service';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { refresh, loaded } from './job-page.actions';
import { mergeMap, map, concatMap, concatMapTo } from 'rxjs/operators';
import { forkJoin } from 'rxjs';
import { DateService } from '../../../services/date.service';
import { jobTitle } from './job-page.selectors';
import { environment } from '../../../../environments/environment';


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

              let tests = report.report.tests;

              const getMediaUrls = (path) => {

                if (!path) {
                  return
                }
                return `${environment.media}${path.replace(/\\/g, '/')}`;
              }

              function onlyUnique(value, index, self) {
                return self.indexOf(value) === index;
              }

              return {
                type: loaded.type,
                payload: {
                  title: this.date.calendar(job.startedAt),
                  scenarios: tests.map( x => { return x.pair.label }).filter(onlyUnique).join(', '),
                  viewports: tests.map( x => { return x.pair.viewportLabel }),
                  totalCases: tests.length,
                  failedCases: tests.filter( x => x.status === 'fail' ).length,
                  startedBy: job.startedBy,
                  status: job.state,

                  cases: tests.map( x => ({

                    label: x.pair.label,
                    status: x.status,
                    error: x.pair.error,
                    viewport: x.pair.viewportLabel,

                    reference: getMediaUrls(x.pair.reference),
                    test: getMediaUrls(x.pair.test),
                    difference:getMediaUrls(x.pair.diffImage),

                    //diffInfo: x.pair.diff
                  }))
                }
              }
            })
          )
        })
      );

    })
  ));
}
