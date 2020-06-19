import { Injectable } from '@angular/core';
import { ApiAdapterService } from 'src/app/services/api-adapter.service';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import {
  refresh,
  loaded,
  runScenario,
  loadedScenarioHistory,
  deleteScenario,
  cloneScenario, saveScenario, refreshScenarioHistory, createScenario, cleanupNgrxStorage
} from './scenario-page.actions';
import { mergeMap, map, take, tap, delay, debounceTime, filter } from 'rxjs/operators';
import { of } from 'rxjs';
import { DateService } from '../../../services/date.service';
import { NavigationService } from '../../../services/navigation.service';
import { FiltersService, IQueryFilter, QueryFilter, QueryFilterType } from '../../../services/filters.service';
import { openScenarioPage } from '../../../store/navigation/navigation.actions';
import { IScenario } from '../../../models/app.models';


@Injectable()
export class ScenarioPageEffects {

  constructor (
    private actions$: Actions,
    private api: ApiAdapterService,
    private date: DateService,
    private navigate: NavigationService,
    private filtersStv: FiltersService
  ) {}

  refresh$ = createEffect(() => this.actions$.pipe(
    ofType(refresh),
    mergeMap((action) => {

      return this.api.getScenario(action.payload.id).pipe(
        map( res => {

          let emptyScenario = {
            authConfig: {}
          };

          return { ...emptyScenario, ...res.data}
        }),
        map( (scenario: IScenario) => {

          return {
            type: loaded.type,
            payload: scenario
          }
        })
      );
    })));

  autoRefreshScenarioHistory$ = createEffect(() => this.actions$.pipe(
      ofType(loadedScenarioHistory, cleanupNgrxStorage),
      debounceTime(5000),
      filter(x => x.type === loadedScenarioHistory.type),
      mergeMap((action) => {

        return of({
          type: refreshScenarioHistory.type,
          payload: {
            id: (action as any).payload.id
          }
        })
      })));

  refreshScenarioHistory$ = createEffect(() => this.actions$.pipe(
    ofType(refreshScenarioHistory),
    mergeMap((action) => {

      return this.api.getScenarioHistory(action.payload.id).pipe(
        map( res => {

          const iconMap:any = {
            pass: 'Passed',
            fail: 'Failed',
            Approved: 'Approved'
          };

          const getUpic = (job) => {
            return job.startedBy && job.startedBy.length > 0 ? job.startedBy[0] : ' '
          };

          return {
            type: loadedScenarioHistory.type,
            payload: {
              id: action.payload.id,
              jobs: res.jobs.map( x => ({
                jobId: x.id,
                state: (iconMap[x.state] || x.state),
                startedBy: x.startedBy,
                startedAt: this.date.calendar(x.startedAt),
                upic: getUpic(x)
              }))
            }
          }
        })
      );
    })));


  runScenario$ = createEffect(() => this.actions$.pipe(
    ofType(runScenario),
    mergeMap((action) => {

      let opts = { scenarios: [action.payload.label] };

      return this.api.run(opts).pipe(
        delay(500),
        map( res => {

          return {
            type: refreshScenarioHistory.type,
            payload: { id: action.payload.id }
          }
        })
      );
    })));

  deleteScenario$ = createEffect(() => this.actions$.pipe(
    ofType(deleteScenario),
    tap((action) => {

      let id = action.payload.id;

      this.api.deleteScenario(id)
        .pipe(take(1))
        .subscribe(res => {

          this.navigate.openScenarios();
        })

    })),
    { dispatch: false }
  );

  cloneScenario$ = createEffect(() => this.actions$.pipe(
    ofType(cloneScenario),
    tap((action) => {

      let id = action.payload.id;

      this.api.cloneScenario(id, 'Scenario_' + this.date.short(new Date()))
        .pipe(take(1))
        .subscribe(res => {

          this.navigate.openScenario(res.data._id);
        })

    })),
    { dispatch: false }
  );

  saveScenario$ = createEffect(() => this.actions$.pipe(
    ofType(saveScenario),
    mergeMap((action:any) => {

      return this.api.updateScenario(action.payload.scenario).pipe(
        map( res => {
          return { type: refresh.type, payload: { id: res.data._id} }
        })
      );
    })
  ));

  createScenario$ = createEffect(() => this.actions$.pipe(
    ofType(createScenario),
    mergeMap((action:any) => {

      return this.api.createScenario(action.payload.scenario).pipe(
        map( res => {

          // If Ok - navigate to scenario page
          // If error - show error

          return { type: openScenarioPage.type, payload: { scenarioId: res.data._id} }
        })
      );
    })
  ));
}
