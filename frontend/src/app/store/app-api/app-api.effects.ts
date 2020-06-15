import { Injectable } from '@angular/core';
import { catchError, map, mergeMap, tap } from 'rxjs/operators';
import { act, Actions, createEffect, ofType } from '@ngrx/effects';

import { operationCompleted, runFilteredScenariosOp } from './app-api.actions';
import { NavigationService } from '../../services/navigation.service';

import { concat, of } from 'rxjs';
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
export class AppApiEffects {

  constructor (
    private actions$: Actions,
    private api: ApiAdapterService,
    private date: DateService,
    private navigate: NavigationService,
    private store: Store
  ) {}

  runFilteredScenariosOp$ = createEffect(() => this.actions$.pipe(
    ofType(runFilteredScenariosOp),
    mergeMap((action) => {

      console.log(action)

      const corId = action.payload.correlationId;

      return this.api
        .run({
          scenarios: action.payload.scenarios,
          viewports: action.payload.viewports
        })
        .pipe(
          map( (res) => {
            console.log(res)
            return operationCompletedAction(corId)
          }),
          catchError(err => {
            return of(operationCompletedAction(corId, err));
          })
        );

    })));

}
