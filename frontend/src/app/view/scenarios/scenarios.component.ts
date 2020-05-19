import { Component, OnDestroy, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { ActivatedRoute } from '@angular/router';
import { NavigationService } from '../../services/navigation.service';
import { selectLoading, selectScenarios, selectViewports } from '../configuration/store/configuration.selectors';
import { deleteScenario, favoriteScenario, refresh } from '../configuration/store/configuration.actions';
import { map } from 'rxjs/operators';
import { runOneScenario } from '../dashboard/store/dashboard.actions';
import { cleanupNgrxStorage } from '../configuration/store/configuration.actions';

@Component({
  selector: 'app-scenarios',
  templateUrl: './scenarios.component.html',
  styleUrls: ['./scenarios.component.css']
})
export class ScenariosComponent implements OnInit, OnDestroy {

  url:string = "http://localhost";

  isLoading$;
  viewports$;
  scenarios$;

  constructor(private store: Store,
              private route: ActivatedRoute,
              private navigation: NavigationService
  ) {}

  ngOnInit () {

    this.isLoading$ = this.store.pipe(select(selectLoading));
    this.viewports$ = this.store.pipe(select(selectViewports)).pipe(
      map( x => { return x.map( (s:any) => s.label) })
    );
    this.scenarios$ = this.store.pipe(select(selectScenarios));

    this.refresh()
  }
  ngOnDestroy () {
    this.store.dispatch(cleanupNgrxStorage())
  }

  addScenarioHandler () {
    // this.modals.addScenarioModal.open();
    console.log('addScenarioHandler')
    this.navigation.openNewScenario();
  }
  runFilteredScenariosHandler () {
    console.log('runFilteredScenariosHandler')
  }
  removeFilteredScenariosHandler () {
    console.log('removeFilteredScenariosHandler')
  }

  search ($event) {
    console.log('search', $event)
  }
  refresh () {
    this.store.dispatch(refresh({payload: {id: null}}));
  }
  showDifference () {
    console.log('showDifference')
  }
  listView () {
    console.log('listView')
  }

  selectScenarioHandler ($event) {
    this.navigation.openScenario($event);
  }
  runScenarioHandler ($event:any, label:string) {
    console.log('runScenarioHandler', $event);
    this.store.dispatch(runOneScenario( {label: label}));
  }
  deleteScenarioHandler ($event) {
    console.log('deleteScenarioHandler', $event);
    this.store.dispatch( deleteScenario({payload: {id:$event}}))
  }
  favoriteScenarioHandler ($event) {
    console.log('favoriteScenarioHandler', $event);
    this.store.dispatch( favoriteScenario({payload: {id:$event}}))
  }

  changeStatusFilter_Passed ($event) {
    console.log('changeStatusFilter_Passed', $event)
  }
  changeStatusFilter_Failed ($event) {
    console.log('changeStatusFilter_Failed', $event)
  }
  changeViewportsFilter ($event) {
    console.log('changeViewportsFilter', $event)
  }

  showMobileFilters () {
    console.log('showMobileFilters')
  }
}
