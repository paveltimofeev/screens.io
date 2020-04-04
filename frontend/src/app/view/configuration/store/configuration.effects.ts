import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { ApiAdapterService, IConfig } from '../../../services/api-adapter.service';
import { concatMap, map, mergeMap, withLatestFrom } from 'rxjs/operators';
import {
  refresh,
  loaded,
  updateScenario,
  deleteCurrentScenario,
  createScenario,
  createViewport
} from './configuration.actions';
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


  createScenario$ = createEffect(() => this.actions$.pipe(
    ofType(createScenario),
    mergeMap((data:any) => {



      return this.api.getConfig().pipe(
        mergeMap( (config:{data:IConfig}) => {

          const idx = config.data.scenarios.findIndex( x => x.label === data.label );
          if (idx === -1) {
            config.data.scenarios.push(data);
          }

          return this.api.updateConfig(config.data).pipe(
            map( res => {

              return { type: refresh.type }
            })
          );

        })
      );

    })
  ));

  createViewport$ = createEffect(() => this.actions$.pipe(
    ofType(createViewport),
    mergeMap((data:any) => {

      return this.api.getConfig().pipe(
        mergeMap( (config:{data:IConfig}) => {

          const width = parseInt(data.width);
          const height = parseInt(data.height);

          const idx = config.data.viewports.findIndex( x => x.width === width && x.height === height );

          if (idx === -1 && !isNaN(height) && !isNaN(width) && height > 100 && height < 10000 && width > 100 && width < 10000) {

            config.data.viewports.push({
              width,
              height,
              label: `${data.width} × ${data.height}`
            });
          }

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
