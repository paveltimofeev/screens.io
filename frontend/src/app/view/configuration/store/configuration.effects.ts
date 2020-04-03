import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { ApiAdapterService, IConfig } from '../../../services/api-adapter.service';
import { concatMap, map, mergeMap, withLatestFrom } from 'rxjs/operators';
import { refresh, loaded, updateScenario, deleteCurrentScenario } from './configuration.actions';
import { of } from 'rxjs';
import { select, Store } from '@ngrx/store';
import { selectCurrentScenarioLabel } from './configuration.selectors';

@Injectable()
export class ConfigurationEffects {

  constructor(
    private actions$: Actions,
    private api: ApiAdapterService,
    private store: Store
  ){}

  deleteScenario$ = createEffect(() => this.actions$.pipe(
    ofType(deleteCurrentScenario),
    concatMap(action => {
      return of(action).pipe(
        withLatestFrom(this.store.pipe(select(selectCurrentScenarioLabel)))
      );
    }),
    mergeMap(([action, label]) => {

      return this.api.deleteScenario(label).pipe(
        map( res => {
          return { type: refresh.type }
        })
      );
    })
  ));

  updateScenario$ = createEffect(() => this.actions$.pipe(
    ofType(updateScenario),
    mergeMap((data:any) => {



      return this.api.getConfig().pipe(
        mergeMap( (config:{data:IConfig}) => {

          const idx = config.data.scenarios.findIndex( x => x.label === data.label );
          config.data.scenarios[idx] = data;

          return this.api.updateConfig(config.data).pipe(
            map( res => {

              return { type: refresh.type }
            })
          );

        })
      );

    })
  ));

  refresh$ = createEffect( () => this.actions$.pipe(
    ofType(refresh),
    mergeMap(() => {

      return this.api.getConfig().pipe(
        map( res => {

          return {
            type: loaded.type,
            payload: {
              viewportsList: res.data.viewports.map(x => `${x.width} × ${x.height}`),
              scenariosList: res.data.scenarios.map( x=> x.label ),
              scenarios: res.data.scenarios
            }
          }
        })
      )
    })
    )
  );
}
