import { Injectable } from '@angular/core';
import { ApiAdapterService } from 'src/app/services/api-adapter.service';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { approve, loaded, refresh, runAgain } from './comparer.actions';
import { map, mergeMap } from 'rxjs/operators';
import { DateService } from '../../../services/date.service';
import { of } from 'rxjs';
import { environment } from '../../../../environments/environment';


@Injectable()
export class ComparerEffects {

  constructor(
    private actions$: Actions,
    private api: ApiAdapterService,
    private date: DateService
  ){}

  refresh$ = createEffect(() => this.actions$.pipe(
    ofType(refresh),
    mergeMap((action) => {

      return this.api.getHistoryRecord(action.payload.jobId).pipe(
        mergeMap( job => {

          return this.api.getReport(job.runId).pipe(
            map( res => {

              const idx = action.payload.testCaseIndex - 1;

              const status = res.report.tests[ idx ].status;
              const testCase = res.report.tests[ idx ].pair;

              const getMediaUrls = (path) => {

                if (!path) {
                  return
                }
                return `${environment.media}${path.replace(/\\/g, '/')}`;
              }


              return {
                type: loaded.type,
                payload: {
                  title: `${testCase.label} ${testCase.viewportLabel}`,
                  status: status,

                  reportId: res.report._id,
                  job: this.date.calendar(job.startedAt),
                  scenarioId: job.scenarios.filter( x => x.label === testCase.label).map(x => x.id)[0],
                  scenario: testCase.label,
                  viewport: testCase.viewportLabel,

                  scenarios: job.scenarios.filter( x => x.label !== testCase.label).map(x => x.label),
                  //scenariosFull: job.scenarios.filter( x => x.label !== testCase.label).map(x => ({id:x.id, label:x.label})),
                  viewports: job.viewports.filter( x => x !== testCase.viewportLabel),

                  referenceImage: getMediaUrls(testCase.reference),
                  differenceImage: getMediaUrls(testCase.diffImage),
                  testImage: getMediaUrls(testCase.test),

                  diff: testCase.diff,
                  misMatchThreshold: testCase.misMatchThreshold,
                  url: testCase.url
                }
              }
            })
          )

      }))
    })
  ));

  approve$ = createEffect(() => this.actions$.pipe(
    ofType(approve),
    mergeMap((action) => {

      console.log(action);

      let testCase = {
        reportId: action.payload.reportId,
        label: action.payload.scenario,
        viewportLabel: action.payload.viewport
      };

      return this.api.approveCase(testCase)
        .pipe(
          map( res => {

            console.log(res);

            return {
              type: refresh.type,
              payload: {
                jobId: action.payload.jobId,
                testCaseIndex: action.payload.testCaseIndex
              }}

          })
        );

    })));

  runAgain$ = createEffect(() => this.actions$.pipe(
    ofType(runAgain),
    mergeMap((action) => {

      const opts = {
        filter: action.payload.scenario,
        viewport: action.payload.viewport
      };

      return this.api.run(opts)
        .pipe(
          map( (res) => {
            console.log(res);

            return {
              type: refresh.type,
              payload: {
                jobId: action.payload.jobId,
                testCaseIndex: action.payload.testCaseIndex
              }}
          })
        );

    })));
}
