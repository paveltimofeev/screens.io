import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { ApiAdapterService } from '../../../services/api-adapter.service';
import { map, mergeMap } from 'rxjs/operators';
import { refresh, loaded, updateScenario, updated, error } from './configuration.actions';

@Injectable()
export class ConfigurationEffects {

  constructor(
    private actions$: Actions,
    private api: ApiAdapterService
  ){}

  updateConfig$ = createEffect(() => this.actions$.pipe(
    ofType(updateScenario),
    mergeMap((data) => {

      return this.api.updateConfig(data).pipe(
        map( res => {

          return {
            type: !res.error ? updated.type : error.type,
            payload: res.error
          }
        })
      )
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
