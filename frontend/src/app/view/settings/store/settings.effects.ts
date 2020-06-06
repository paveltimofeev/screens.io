import { Injectable } from '@angular/core';
import { ApiAdapterService } from 'src/app/services/api-adapter.service';
import { Actions, createEffect, ofType } from '@ngrx/effects';

import {
  mergeMap,
  map,
  delay,
  catchError,
  withLatestFrom
} from 'rxjs/operators';
import { concat, Observable, of } from 'rxjs';
import { DateService } from '../../../services/date.service';
import { NavigationService } from '../../../services/navigation.service';
import {
  cleanupUpdateViewportsError,
  deleteAccount,
  loadedAccountInfo,
  loadedViewports, operationCompleted,
  refreshAccountInfo,
  refreshViewports,
  updateAccountInfo, updatePassword, updateViewports, updateViewportsError
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

  createSuccessAction(correlationId) {

    return {
      type: operationCompleted.type,
      payload: { correlationId }
    }
  }

  createErrorCaseActions(errorMessage, correlationId): Observable<any> {

    return concat(
      [
        this.createSuccessAction(correlationId),
        {
          type: updateViewportsError.type,
          payload: { errorMessage, correlationId }
        }
      ]
    )
  }



  refreshAccountInfo$ = createEffect(() => this.actions$.pipe(
    ofType(refreshAccountInfo),
    mergeMap((action) => {

      return this.api.getAllViewports().pipe(
        map( res => {

          return {
            type: loadedAccountInfo.type,
            // payload: res.data
            payload: {
              name: 'Djordje Kluni',
              email: 'djordje.kluni@imeil.com'
            }
          }
        })
      );
    })));

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


  updateAccountInfo$ = createEffect(() => this.actions$.pipe(
    ofType(updateAccountInfo),
    mergeMap((action) => {

      const corId = action.payload.correlationId;

      return this.api.updateAccountInfo(action.payload)
        .pipe(
          map( () => this.createSuccessAction(corId)),
          catchError(err => {
            return this.createErrorCaseActions(err, corId)
          })
        );
    })));

  updatePassword$ = createEffect(() => this.actions$.pipe(
    ofType(updatePassword),
    mergeMap((action) => {

      const corId = action.payload.correlationId;

      return this.api.updatePassword(action.payload)
        .pipe(
          map( () => this.createSuccessAction(corId)),
          catchError(err => {
            return this.createErrorCaseActions(err, corId)
          })
        );

    })));

  deleteAccount$ = createEffect(() => this.actions$.pipe(
    ofType(deleteAccount),
    mergeMap((action) => {

      const corId = action.payload.correlationId;

      return this.api.deleteAccount(action.payload)
        .pipe(
          map( () => {
            this.navigate.singOut();
            return this.createSuccessAction(corId);
          }),
          catchError(err => {
            return this.createErrorCaseActions(err, corId)
          })
        );
    })),
    {dispatch: false});


  updateViewports$ = createEffect(() => this.actions$.pipe(
    ofType(updateViewports),
    withLatestFrom(this.store.select(viewportsData)),
    mergeMap(([action, viewportsData]) => {

      const corId = action.payload.correlationId;

      return this.api
        .updateViewports(viewportsData)
        .pipe(
          map( () => this.createSuccessAction(corId) ),
          catchError(err => {
            return this.createErrorCaseActions(err, corId)
          })
        );
    })));

  updateViewportsError$ = createEffect(() => this.actions$.pipe(
    ofType(updateViewportsError),
    delay(5000),
    mergeMap(() => {

      return of({type: cleanupUpdateViewportsError.type})
    }))
  );
}
