import { Injectable } from '@angular/core';
import { ApiAdapterService } from 'src/app/services/api-adapter.service';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import {
  refresh,
  loaded,
  runScenario,
  loadedScenarioHistory,
  deleteScenario,
  cloneScenario, saveScenario
} from './scenario-page.actions';
import { mergeMap, map, concatMap, concatMapTo, take, tap } from 'rxjs/operators';
import { forkJoin } from 'rxjs';
import { DateService } from '../../../services/date.service';
import { environment } from '../../../../environments/environment';
import { NavigationService } from '../../../services/navigation.service';
import { updateScenario } from '../../configuration/store/configuration.actions';


@Injectable()
export class ScenarioPageEffects {

  constructor (
    private actions$: Actions,
    private api: ApiAdapterService,
    private date: DateService,
    private navigate: NavigationService
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
