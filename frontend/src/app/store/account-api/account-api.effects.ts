import { Injectable } from '@angular/core';
import { catchError, map, mergeMap, tap } from 'rxjs/operators';
import { Actions, createEffect, ofType } from '@ngrx/effects';

import {
  loadedAccountInfo, refreshAccountInfo,
  deleteAccountOp,
  updateAccountInfoOp,
  updatePasswordOp,
  operationCompleted
} from './account-api.actions';
import { NavigationService } from '../../services/navigation.service';

import { of } from 'rxjs';
import { ApiAdapterService } from '../../services/api-adapter.service';
import { DateService } from '../../services/date.service';
import { Store } from '@ngrx/store';


const operationCompletedAction = (correlationId: string, error:any = null) => {

  return {
    type: operationCompleted.type,
    payload: { correlationId, success: !error, error }
  }
};

@Injectable()
export class AccountApiEffects {

  constructor (
    private actions$: Actions,
    private api: ApiAdapterService,
    private date: DateService,
    private navigate: NavigationService,
    private store: Store
  ) {}

  refreshAccountInfo$ = createEffect(() => this.actions$.pipe(
    ofType(refreshAccountInfo),
    mergeMap((action) => {

      return this.api.getAccountInfo().pipe(
        map( res => {

          return {
            type: loadedAccountInfo.type,
            payload: res
          }
        })
      );
    })));

  updateAccountInfo$ = createEffect(() => this.actions$.pipe(
    ofType(updateAccountInfoOp),
    mergeMap((action) => {

      const corId = action.payload.correlationId;

      return this.api.updateAccountInfo(action.payload.accountInfo)
        .pipe(
          map( () => operationCompletedAction(corId)),
          catchError(err => {
            return of(operationCompletedAction(corId, err));
          })
        );
    })));

  updatePassword$ = createEffect(() => this.actions$.pipe(
    ofType(updatePasswordOp),
    mergeMap((action) => {

      const corId = action.payload.correlationId;

      return this.api.updatePassword({currentPassword: action.payload.currentPassword, newPassword:action.payload.newPassword})
        .pipe(
          map( () => operationCompletedAction(corId)),
          catchError(err => {
            return of(operationCompletedAction(corId, err));
          })
        );

    })));

  deleteAccount$ = createEffect(() => this.actions$.pipe(
    ofType(deleteAccountOp),
    mergeMap((action) => {

      const corId = action.payload.correlationId;

      return this.api.deleteAccount({password: action.payload.password})
        .pipe(
          map( () => {
            this.navigate.singOut();
            return operationCompletedAction(corId);
          }),
          catchError(err => {
            return of(operationCompletedAction(corId, err));
          })
        );
    })),
    {dispatch: false});
}
