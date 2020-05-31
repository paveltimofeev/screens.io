import { Injectable } from '@angular/core';
import { ApiAdapterService } from 'src/app/services/api-adapter.service';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { loaded, refresh, removeFilter, setFilter } from './scenarios.actions';
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
        this.api.getViewports()
      ];

      return forkJoin( requests ).pipe(
        map(res => {

          return {
            type: loaded.type,
            payload: {
              scenarios: res[0].data,
              scenariosList: res[0].data.map( x => ({
                  ...x,
                  meta_referenceImageUrl: `${environment.media}${x.meta_referenceImageUrl}`
                })
              ),
              viewportsList: res[1].data
            }
          }
        })
      );

    })
    ));

}
