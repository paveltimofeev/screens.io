import { Injectable } from '@angular/core';
import { ApiAdapterService } from 'src/app/services/api-adapter.service';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { refresh, loaded, approve, approveAllFailedCases, runFailed } from './job-page.actions';
import { mergeMap, map, withLatestFrom } from 'rxjs/operators';
import { DateService } from '../../../services/date.service';
import { environment } from '../../../../environments/environment';
import { Store } from '@ngrx/store';
import { failedCases } from './job-page.selectors';
import { concat, of } from 'rxjs';


@Injectable()
export class JobPageEffects {

  constructor(
    private actions$: Actions,
    private api: ApiAdapterService,
    private date: DateService,
    private store: Store
  ){}

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

              const errorCodes = {
                'NO_REFERENCE': 'There\'s no approved reference for this scenario and viewport',
                'NO_RESULTS': 'Cannot load test results. Probably test crashed or timeout exceeded',
              };

              return {
                type: loaded.type,
                payload: {
                  title: this.date.calendar(job.startedAt),
                  scenarios: tests.map( x => { return x.pair.label }).filter(onlyUnique),
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
                    error: x.pair.engineErrorMsg || errorCodes[x.pair.error] || x.pair.error,
                    viewport: x.pair.viewportLabel,

                    reference: getMediaUrls(x.pair.reference),
                    test: getMediaUrls(x.pair.test),
                    difference: getMediaUrls(x.pair.diffImage),
                    diff: x.pair.diff /// x.pair.diff.misMatchPercentage '0.04'
                  }))
                }
              }
            })
          )
        })
      );

    })
  ));


  approve$ = createEffect(() => this.actions$.pipe(
    ofType(approve),
    mergeMap((action) => {

      console.log('approve', action);

      return this.api.approveCase(action.payload.testCase).pipe(
        map( res => ({ type: refresh.type, payload: { id: action.payload.jobId }}))
      )
    })));


  /* PAGE ACTIONS*/

  runFailedHandler$ = createEffect(() => this.actions$.pipe(
    ofType(runFailed),
    withLatestFrom(this.store.select(failedCases)),
    mergeMap( ([action, cases]) => {

      const opts = { scenarios: cases.map( x => x.label) };

      return this.api.run(opts).pipe(
        map( res => ({ type: refresh.type, payload: { id: action.payload.jobId }}))
      )
    })));

  approveAllFailedCases$ = createEffect(() => this.actions$.pipe(
    ofType(approveAllFailedCases),
    withLatestFrom(this.store.select(failedCases)),
    mergeMap(([action, cases]) => {

      const actions = cases.map( x => ({
          type: approve.type,
          payload: {
            jobId: action.payload.jobId,
            testCase: {
              reportId: x.reportId,
              label: x.label,
              viewportLabel: x.viewport
            }
          }
        }
      ));

      console.log(actions);

      return concat(actions)

      // return of({type: 'null'});

      // return this.api.approveCase(action.payload.testCase).pipe(
      //   map( res => ({ type: refresh.type, payload: { id: action.payload.jobId }}))
      // )
    })));
}
