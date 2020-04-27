import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { ApiAdapterService, IConfig } from '../../../services/api-adapter.service';
import { concatMap, map, mergeMap, withLatestFrom } from 'rxjs/operators';
import {
  refresh,
  loaded,
  updateScenario,
  deleteCurrentScenario,
  cloneCurrentScenario,
  createScenario,
  createViewport, deleteViewport, favoriteCurrentScenario, setFavoriteResult, redirect
} from './configuration.actions';
import { forkJoin, of } from 'rxjs';
import { select, Store } from '@ngrx/store';
import { selectCurrentScenario, selectCurrentScenarioLabel } from './configuration.selectors';

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
        withLatestFrom(this.store.pipe(select(selectCurrentScenario)))
      );
    }),
    mergeMap(([action, scenario]) => {

      return this.api.deleteScenario(scenario).pipe(
        map( res => {
          return { type: refresh.type }
        })
      );
    })
  ));

  deleteViewport$ = createEffect(() => this.actions$.pipe(
    ofType(deleteViewport),
    mergeMap((action) => {

      return this.api.deleteViewport(action.label).pipe(
        map( res => { return { type: refresh.type } })
      )
    })
  ));

  updateScenario$ = createEffect(() => this.actions$.pipe(
    ofType(updateScenario),
    mergeMap((action:any) => {

      console.log('updateScenario$', action.payload)

      return this.api.updateScenario(action.payload).pipe(
        map( res => {
          return { type: refresh.type, payload: { id: action.payload._id} }
        })
      );
    })
  ));

  cloneScenario$ = createEffect(() => this.actions$.pipe(
    ofType(cloneCurrentScenario),
    concatMap(action => {
      return of(action).pipe(
        withLatestFrom(this.store.pipe(select(selectCurrentScenario)))
      );
    }),
    mergeMap(([action, scenario]) => {

      console.log('cloneScenario$', action)

      return this.api.cloneScenario(scenario).pipe(
        map( res => {
          return { type: refresh.type }
        })
      );
    })
  ));

  favoriteCurrentScenario$ = createEffect(() => this.actions$.pipe(
    ofType(favoriteCurrentScenario),
    concatMap(action => {
      return of(action).pipe(
        withLatestFrom(this.store.pipe(select(selectCurrentScenario)))
      );
    }),
    mergeMap(([action, scenario]) => {

      console.log('favoriteCurrentScenario$', action)

      if (scenario.meta_isFavorite) {

        return this.api.removeScenarioToFavorites(scenario).pipe(
          map(res => { return {type: setFavoriteResult.type, payload: false} })
        );
      }
      else {

        return this.api.addScenarioToFavorite(scenario).pipe(
          map(res => { return {type: setFavoriteResult.type, payload: true} })
        );
      }
    })
  ));


  createScenario$ = createEffect(() => this.actions$.pipe(
    ofType(createScenario),
    mergeMap((action:any) => {

      return this.api.createScenario(action.payload).pipe(
        map( res => {
          return { type: refresh.type }
        })
      );
    })
  ));

  createViewport$ = createEffect(() => this.actions$.pipe(
    ofType(createViewport),
    mergeMap((data:any) => {

      const width = parseInt(data.width);
      const height = parseInt(data.height);

      if (height > 100 && height < 10000 && width > 100 && width < 10000) {

        return this.api
          .createViewport({width, height, label: `${data.width} × ${data.height}`})
          .pipe(
            map( (res) => {return {type: refresh.type}})
          )
      }
      else {
        return of({type: refresh.type})
      }
    }
  )));

  refresh$ = createEffect( () => this.actions$.pipe(
    ofType(refresh),
    mergeMap((action) => {

      let requests = [
        this.api.getScenarios(),
        this.api.getViewports()
      ];

      if (action.payload.id != undefined) {
        requests.push( this.api.getScenario(action.payload.id) )
        requests.push( this.api.getHistoryOfScenario(action.payload.id) )
      }

      return forkJoin( requests ).pipe(
        map(res => {

          return {
            type: loaded.type,
            payload: {
              scenarios: res[0].data,
              scenariosList: res[0].data,
              viewportsList: res[1].data,
              currentScenario: res.length > 2 ? res[2].data : res[0].data[0],
              currentScenarioHistory: res.length > 3 ? res[3].jobs.map(j => {
                j.scenarios = j.scenarios.filter( s => s.id === action.payload.id)
                return j
              }).map(j => {
                return {
                  runId: j.runId,
                  startedAt: j.startedAt,
                  state: j.scenarios[0].status
                }
              }) : [],
            }
          }
        })
      );

    })
    )
  );
}
