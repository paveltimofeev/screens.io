import { Injectable } from '@angular/core';
import { ApiAdapterService } from 'src/app/services/api-adapter.service';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { refresh, loaded, approve, approveAllFailedCases, runFailed } from './job-page.actions';
import { mergeMap, map, withLatestFrom } from 'rxjs/operators';
import { DateService } from '../../../services/date.service';
import { environment } from '../../../../environments/environment';
import { Store } from '@ngrx/store';
import { failedCases, cases } from './job-page.selectors';
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

              let tests = res.report ? res.report.tests : [];

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

              const testCaseAdapter = ( test:any ) => {

                return {

                  reportId:           res.report._id,
                  status:             test.status,

                  scenarioId:         getScenarioId( job, test.pair.label ),
                  label:              test.pair.label,
                  error:              test.pair.engineErrorMsg || errorCodes[test.pair.error] || test.pair.error,
                  viewport:           test.pair.viewportLabel,
                  diff:               test.pair.diff,
                  misMatchPercentage: test.pair.diff ? test.pair.diff.misMatchPercentage : undefined,

                  reference:          getMediaUrls( test.pair.reference ),
                  test:               getMediaUrls( test.pair.test ),
                  difference:         getMediaUrls( test.pair.diffImage ),
                  meta_testLG:        getMediaUrls( test.pair.meta_testLG ),
                  meta_diffImageLG:   getMediaUrls( test.pair.meta_diffImageLG )
                }
              }

              return {
                type: loaded.type,
                payload: {
                  title:            this.date.calendar(job.startedAt),
                  breadcrumbTitle:  job._id,
                  startedBy:        job.startedBy,
                  startedAt:        job.startedAt,
                  runningTime:      this.date.fromNow(job.startedAt),
                  status:           job.state,

                  resultStats:      `${tests.filter( x => x.status === 'fail' ).length || tests.length}/${tests.length}`,
                  failedCases:      tests.filter( x => x.status === 'fail' ).length,
                  totalCases:       tests.length,
                  scenarios:        tests.map( x => { return x.pair.label }).filter(onlyUnique),
                  viewports:        tests.map( x => { return x.pair.viewportLabel }).filter(onlyUnique),

                  cases: tests.map(testCaseAdapter)
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
    withLatestFrom(this.store.select(cases)),
    mergeMap(([action, cases]) => {

      const actions = [];

      cases.forEach( (x, idx) => {

        if(x.status === 'fail') {

          actions.push({
            type: approve.type,
            payload: {
              jobId: action.payload.jobId,
              testCase: { reportId: x.reportId, testCaseIndex: idx }
            }
          });
        }

      });

      return concat(actions)
    })));
}
