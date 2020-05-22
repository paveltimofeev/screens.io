import { Injectable } from '@angular/core';
import { ApiAdapterService } from 'src/app/services/api-adapter.service';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { refresh, loaded, approve } from './job-page.actions';
import { mergeMap, map } from 'rxjs/operators';
import { DateService } from '../../../services/date.service';
import { environment } from '../../../../environments/environment';


@Injectable()
export class JobPageEffects {

  constructor(
    private actions$: Actions,
    private api: ApiAdapterService,
    private date: DateService
  ){}

  approve$ = createEffect(() => this.actions$.pipe(
    ofType(approve),
    mergeMap((action) => {

      return this.api.approveCase(action.payload.testCase).pipe(
        map( res => ({ type: refresh.type }))
      )
    })));

  refresh$ = createEffect(() => this.actions$.pipe(
    ofType(refresh),
    mergeMap((action) => {


      return this.api.getHistoryRecord(action.payload.id).pipe(
        mergeMap( job => {

          return this.api.getReport(job.runId).pipe(
            map ( res => {

              let tests = res.report.tests;


              const getScenarioId = (job:any, scenarioLabel:string) => {

                let scenarios = job.scenarios.filter(s => s.label === scenarioLabel)
                if (!scenarios || scenarios.length !== 1 || !scenarios[0]) {
                  return undefined;
                }
                return scenarios[0].id
              }

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
                  viewports: tests.map( x => { return x.pair.viewportLabel }).filter(onlyUnique),
                  totalCases: tests.length,
                  failedCases: tests.filter( x => x.status === 'fail' ).length,
                  startedBy: job.startedBy,
                  status: job.state,


                  cases: tests.map( x => ({

                    reportId: res.report._id,
                    scenarioId: getScenarioId(job, x.pair.label),
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
