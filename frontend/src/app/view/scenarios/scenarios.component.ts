import { Component, OnDestroy, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { NavigationService } from '../../services/navigation.service';
import {
  refresh,
  cleanupNgrxStorage,
  switchFullHeightMode,
  deleteScenario,
  favoriteScenario,
  setSearchFilter
} from './store/scenarios.actions';
import { viewportsList, scenariosList, fullHeightModeOn } from './store/scenarios.selectors';
import { runOneScenario } from '../overview/store/overview.actions';

@Component({
  selector: 'app-scenarios',
  templateUrl: './scenarios.component.html',
  styleUrls: ['./scenarios.component.css']
})
export class ScenariosComponent implements OnInit, OnDestroy {

  viewports$: Observable<any>;
  scenarios$: Observable<any>;
  fullHeightModeOn$: Observable<boolean>;

  constructor(private store: Store,
              private route: ActivatedRoute,
              private navigation: NavigationService
  ) {}

  ngOnInit () {

    this.viewports$ = this.store.pipe(select(viewportsList)).pipe(
      map( x => { return x.map( (s:any) => s.label) })
    );
    this.scenarios$ = this.store.pipe(select(scenariosList));
    this.fullHeightModeOn$ = this.store.pipe(select(fullHeightModeOn));

    this.refresh()
  }
  ngOnDestroy () {
    this.store.dispatch(cleanupNgrxStorage())
  }


  /* PAGE ACTIONS */

  addScenarioHandler () {
    this.navigation.openNewScenario();
  }
  runFilteredScenariosHandler () {

  }
  removeFilteredScenariosHandler () {

  }


  /* DATA ACTIONS */
  searchScenarioHandler (filter: string) {
    this.store.dispatch( setSearchFilter({payload:{filter}}) );
  }
  refresh () {
    this.store.dispatch(refresh());
  }
  fullHeightMode () {
    this.store.dispatch(switchFullHeightMode());
  }


  /* DATA ITEM ACTIONS */

  selectScenarioHandler ($event) {
    this.navigation.openScenario($event);
  }
  runScenarioHandler ($event:any, label:string) {
    this.store.dispatch(runOneScenario( {label: label}));
  }
  deleteScenarioHandler ($event) {
    this.store.dispatch( deleteScenario({payload: {id:$event}}))
  }
  favoriteScenarioHandler ($event) {
    this.store.dispatch( favoriteScenario({payload: {id:$event}}))
  }


  /* FILTER ACTIONS  */

  changeStatusFilter_Passed ($event) {

  }
  changeStatusFilter_Failed ($event) {

  }
  changeViewportsFilter ($event) {

  }

  showMobileFilters () {

  }
}
