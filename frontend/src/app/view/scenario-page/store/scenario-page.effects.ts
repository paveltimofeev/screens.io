import { Injectable } from '@angular/core';
import { ApiAdapterService } from 'src/app/services/api-adapter.service';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import {
  refresh,
  loaded,
  runScenario,
  loadedScenarioHistory,
  deleteScenario,
  cloneScenario, saveScenario, refreshScenarioHistory
} from './scenario-page.actions';
import { mergeMap, map, concatMap, concatMapTo, take, tap } from 'rxjs/operators';
import { forkJoin } from 'rxjs';
import { DateService } from '../../../services/date.service';
import { environment } from '../../../../environments/environment';
import { NavigationService } from '../../../services/navigation.service';
import { updateScenario } from '../../configuration/store/configuration.actions';
import { Filters } from '../../../ui-kit/widget-run/widget-run.component';
import { FiltersService, IQueryFilter, QueryFilter, QueryFilterType } from '../../../services/filters.service';


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

          return {
            type: loaded.type,
            payload: res.data
          }
        })
      );
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
            payload: res.jobs.map( x => ({
              jobId: x.id,
              state: (iconMap[x.state] || x.state),
              startedBy: x.startedBy,
              startedAt: this.date.calendar(x.startedAt),
              upic: getUpic(x)
            }))
          }
        })
      );
    })));


  runScenario$ = createEffect(() => this.actions$.pipe(
    ofType(runScenario),
    mergeMap((action) => {

      let opts = {filter: action.payload.label};

      return this.api.run(opts).pipe(
        map( res => {

          return {
            type: loadedScenarioHistory.type,
            payload: res.data
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
}
