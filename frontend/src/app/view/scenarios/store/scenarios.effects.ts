import { Injectable } from '@angular/core';
import { ApiAdapterService } from 'src/app/services/api-adapter.service';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { deleteScenario, favoriteScenario, loaded, refresh, removeFilter, setFilter } from './scenarios.actions';
import { mergeMap, map, withLatestFrom } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { DateService } from 'src/app/services/date.service';
import { environment } from 'src/environments/environment';
import { forkJoin } from 'rxjs';
import { filters } from './scenarios.selectors';


@Injectable()
export class ScenariosEffects {

  constructor (
    private actions$: Actions,
    private store: Store,
    private date: DateService,
    private api: ApiAdapterService
  ) {}

  refresh$ = createEffect( () => this.actions$.pipe(
    ofType(refresh),
    withLatestFrom(this.store.select(filters)),
    mergeMap(([action, filters]) => {

      let requests = [
        this.api.getScenarios(),
        this.api.getEnabledViewports()
      ];

      return forkJoin( requests ).pipe(
        map(res => {

          return {
            type: loaded.type,
            payload: {
              scenarios: res[0].data,
              scenariosList: res[0].data.map( x => ({
                  ...x,
                  meta_referenceMD: `${environment.media}${x.meta_referenceMD}`
                })
              ),
              viewportsList: res[1].data
            }
          }
        })
      );

    })
    ));

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

}
