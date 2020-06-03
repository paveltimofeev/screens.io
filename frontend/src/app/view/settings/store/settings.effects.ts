import { Injectable } from '@angular/core';
import { ApiAdapterService } from 'src/app/services/api-adapter.service';
import { Actions, createEffect, ofType } from '@ngrx/effects';

import { mergeMap, map, concatMap, concatMapTo, take, tap, delay, debounceTime, catchError } from 'rxjs/operators';
import { forkJoin, of } from 'rxjs';
import { DateService } from '../../../services/date.service';
import { environment } from '../../../../environments/environment';
import { NavigationService } from '../../../services/navigation.service';
import { updateScenario } from '../../configuration/store/configuration.actions';
import { Filters } from '../../../ui-kit/widget-run/widget-run.component';
import { FiltersService, IQueryFilter, QueryFilter, QueryFilterType } from '../../../services/filters.service';
import { openScenarioPage } from '../../../store/navigation/navigation.actions';
import {
  deleteAccount,
  loadedAccountInfo,
  loadedViewports, operationCompleted,
  refreshAccountInfo,
  refreshViewports,
  updateAccountInfo, updatePassword, updateViewports
} from './settings.actions';


@Injectable()
export class SettingsEffects {

  constructor (
    private actions$: Actions,
    private api: ApiAdapterService,
    private date: DateService,
    private navigate: NavigationService,
    private filtersStv: FiltersService
  ) {}

  refreshAccountInfo$ = createEffect(() => this.actions$.pipe(
    ofType(refreshAccountInfo),
    mergeMap((action) => {

      return this.api.getViewports().pipe(
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

      return this.api.getViewports().pipe(
        map( res => {

          return {
            type: loadedViewports.type,
            payload: res.data.map(x => ({
              name: x.label,
              width: x.width,
              height: x.height
            }))
          }
        })
      );
    })));


  updateAccountInfo$ = createEffect(() => this.actions$.pipe(
    ofType(updateAccountInfo),
    mergeMap((action) => {

      return of({})
        .pipe(
          delay(3000),
          map( () => {

          return {
            type: operationCompleted.type,
            payload: {
              correlationId: action.payload.correlationId
            }
          }
        })
      );
    })));

  updatePassword$ = createEffect(() => this.actions$.pipe(
    ofType(updatePassword),
    mergeMap((action) => {

      return of({})
        .pipe(
          delay(2000),
          map( () => {

            return {
              type: operationCompleted.type,
              payload: {
                correlationId: action.payload.correlationId
              }
            }
          })
        );
    })));

  deleteAccount$ = createEffect(() => this.actions$.pipe(
    ofType(deleteAccount),
    mergeMap((action) => {

      return of({})
        .pipe(
          delay(4000),
          map( () => {

            this.navigate.singOut();

            return {
              type: operationCompleted.type,
              payload: {
                correlationId: action.payload.correlationId
              }
            }
          })
        );
    })),
    {dispatch: false});


  updateViewports$ = createEffect(() => this.actions$.pipe(
    ofType(updateViewports),
    mergeMap((action) => {

      let result = {
        type: operationCompleted.type,
        payload: {
          correlationId: action.payload.correlationId
        }
      };

      return this.api
        .updateViewports(action.payload.viewports)
        .pipe(
          map( () => {
            return result;
          }),
          catchError((err) => {
            console.log('error', err);
            return of(result)
          })
        );
    })));
}
