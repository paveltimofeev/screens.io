import { Injectable } from '@angular/core';
import { ApiAdapterService } from 'src/app/services/api-adapter.service';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { refresh, loaded } from './overview.actions';
import { mergeMap, map } from 'rxjs/operators';
import { forkJoin } from 'rxjs';

@Injectable()
export class OverviewEffects {

  constructor(
    private actions$: Actions,
    private api: ApiAdapterService
  ){}

  refresh$ = createEffect(() => this.actions$.pipe(
    ofType(refresh),
    mergeMap(() => {

        return forkJoin(
            this.api.getFavoriteScenarios(),
            this.api.getHistory(null, 5)
        ).pipe(

        map( res => {
          return { type: loaded.type, payload: {
               
              //scenarios: res.data
              favoriteScenarios: res[0].data,
              recentJobs: res[1].jobs,
          
              totalScenarios: 0,
              totalViewports: 0,
              lastRunTime: -1,
              totalState: '' 
            }}
        })
      )
    })
  ));
}