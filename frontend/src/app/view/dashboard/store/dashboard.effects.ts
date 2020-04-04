import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map, mergeMap } from 'rxjs/operators';
import { refresh, loaded, runOneScenario } from './dashboard.actions'
import { ApiAdapterService } from '../../../services/api-adapter.service';
import { of } from 'rxjs';

@Injectable()
export class DashboardEffects {

  constructor(
    private actions$: Actions,
    private api: ApiAdapterService
  ){}

  refresh$ = createEffect(() => this.actions$.pipe(
    ofType(refresh),
    mergeMap(() => {

      return this.api.getConfig().pipe(
        map( res => {
          return { type: loaded.type, payload: { scenarios: res.data.scenarios }}
        })
      );
    })
  ));

  runOneScenario$ = createEffect(() => this.actions$.pipe(
    ofType(runOneScenario),
    mergeMap((data) => {

      console.log(data);

      return this.api.run( {filter: data.label} ).pipe(
        map( res => {

          return {type:refresh.type};
        })
      );

    })
  ));

}
