import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map, mergeMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { refresh, loaded } from './dashboard.actions'
import { ApiAdapterService } from '../../../services/api-adapter.service';

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
          return { type: loaded.type, payload: res.data}
        })
      );
    })
  ));

}
