import { Injectable } from '@angular/core';
import { tap } from 'rxjs/operators';
import { Actions, createEffect, ofType } from '@ngrx/effects';

import { openScenarioPage } from './navigation.actions';
import { NavigationService } from '../../services/navigation.service';


@Injectable()
export class NavigationEffects {

  constructor (
    private actions$: Actions,
    private navigate: NavigationService
  ) {}

  openScenarioPage$ = createEffect(() => this.actions$.pipe(
    ofType(openScenarioPage),
    tap((action) => {

      let scenarioId = action.payload.scenarioId;
      this.navigate.openScenario(scenarioId);
    })),
    { dispatch: false }
  );

}
