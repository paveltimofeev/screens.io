import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { ApiAdapterService, IConfig } from '../../../services/api-adapter.service';
import { concatMap, map, mergeMap, withLatestFrom } from 'rxjs/operators';
import {
  refresh,
  loaded,
  updateScenario,
  deleteScenario,
  cloneCurrentScenario,
  createScenario,
  createViewport, deleteViewport, favoriteScenario, setFavoriteResult, redirect
} from './configuration.actions';
import { forkJoin, of } from 'rxjs';
import { select, Store } from '@ngrx/store';
import { selectCurrentScenario, selectCurrentScenarioLabel, selectScenarios } from './configuration.selectors';

@Injectable()
export class ConfigurationEffects {

  constructor(
    private actions$: Actions,
    private api: ApiAdapterService,
    private store: Store
  ){}

  deleteScenario$ = createEffect(() => this.actions$.pipe(
    ofType(deleteScenario),
    mergeMap( action => {

      return this.api.deleteScenario(action.payload.id).pipe(
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

  switchScenarioFavorite$ = createEffect(() => this.actions$.pipe(
    ofType(favoriteScenario),
    mergeMap(action => {

      console.log('switchScenarioFavorite$', action)

      return this.api.switchScenarioFavorite(action.payload.id)
        .pipe(
          map(res => { return {type: refresh.type, payload: false} })
        );
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

      return forkJoin( requests ).pipe(
        map(res => {

          return {
            type: loaded.type,
            payload: {
              scenarios: res[0].data,
              scenariosList: res[0].data,
              viewportsList: res[1].data
            }
          }
        })
      );

    })
    )
  );
}
