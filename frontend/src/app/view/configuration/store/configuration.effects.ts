import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { ApiAdapterService } from '../../../services/api-adapter.service';
import { map, mergeMap } from 'rxjs/operators';
import { refresh, loaded } from './configuration.actions';

@Injectable()
export class ConfigurationEffects {

  constructor(
    private actions$: Actions,
    private api: ApiAdapterService
  ){}

  refresh$ = createEffect( () => this.actions$.pipe(
    ofType(refresh),
    mergeMap(() => {

      return this.api.getConfig().pipe(
        map( res => {

          return {
            type: loaded.type,
            payload: {
              viewports: res.data.viewports.map(x => `${x.width} × ${x.height}`),
              scenarios: res.data.scenarios.map( x=> x.label )
            }
          }
        })
      )
    })
    )
  );
}
