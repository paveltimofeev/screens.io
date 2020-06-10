import { Injectable } from '@angular/core';
import { ApiAdapterService } from 'src/app/services/api-adapter.service';
import { Actions, createEffect, ofType } from '@ngrx/effects';

import {
  mergeMap,
  map,
  catchError,
  withLatestFrom
} from 'rxjs/operators';
import { of } from 'rxjs';
import { DateService } from '../../../services/date.service';
import { NavigationService } from '../../../services/navigation.service';
import {
  loadedViewports, operationCompleted,
  refreshViewports,
  updateViewports
} from './settings.actions';
import { Store } from '@ngrx/store';
import { viewportsData } from './settings.selectors';


@Injectable()
export class SettingsEffects {

  constructor (
    private actions$: Actions,
    private api: ApiAdapterService,
    private date: DateService,
    private navigate: NavigationService,
    private store: Store
  ) {}

  operationCompletedAction(correlationId: string, error:any =null) {

    return {
      type: operationCompleted.type,
      payload: { correlationId, success: !error, error }
    }
  }

  refreshViewports$ = createEffect(() => this.actions$.pipe(
    ofType(refreshViewports),
    mergeMap((action) => {

      return this.api.getAllViewports().pipe(
        map( res => {

          return {
            type: loadedViewports.type,
            payload: res.data.map(x => ({
              _id: x._id,
              label: x.label,
              width: x.width,
              height: x.height,
              enabled: x.enabled
            }))
          }
        })
      );
    })));

  updateViewports$ = createEffect(() => this.actions$.pipe(
    ofType(updateViewports),
    withLatestFrom(this.store.select(viewportsData)),
    mergeMap(([action, viewportsData]) => {

      const corId = action.payload.correlationId;

      return this.api
        .updateViewports(viewportsData)
        .pipe(
          map( () => this.operationCompletedAction(corId) ),
          catchError(err => {
            return of(this.operationCompletedAction(corId, err));
          })
        );
    })));

}
