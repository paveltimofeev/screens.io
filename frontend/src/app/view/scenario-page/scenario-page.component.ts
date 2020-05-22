import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { NavigationService } from '../../services/navigation.service';
import {
  cleanupNgrxStorage,
  cloneScenario,
  refresh,
  refreshScenarioHistory,
  runScenario, saveScenario, deleteScenario
} from './store/scenario-page.actions';
import { Observable } from 'rxjs';
import { IScenarioHistory } from './store/scenario-page.reducer';
import { title, scenario, scenarioHistory } from './store/scenario-page.selectors';
import { map, take, tap } from 'rxjs/operators';

@Component({
  selector: 'app-scenario-page',
  templateUrl: './scenario-page.component.html',
  styleUrls: ['./scenario-page.component.css']
})
export class ScenarioPageComponent implements OnInit, OnDestroy {

  id: string;
  title$: Observable<string>;
  scenario$: Observable<any>;
  scenario: any;
  scenarioHistory$: Observable<IScenarioHistory[]>;
  currentTab:string = 'General'

  constructor(
    private route: ActivatedRoute,
    private store: Store,
    private navigation: NavigationService
  ) {}

  ngOnInit() {

    this.title$ = this.store.select( title );
    this.scenario$ = this.store.select( scenario );
    this.scenario$.subscribe(scenario => this.scenario = scenario);
    this.scenarioHistory$ = this.store.select( scenarioHistory );

    this.route.params.subscribe(params => {

      this.id = this.route.snapshot.params.id;
      this.store.dispatch( refresh({payload:{id:this.id}}) );
      this.store.dispatch( refreshScenarioHistory({payload:{id:this.id}}) );
    });
  }

  ngOnDestroy () {
    this.store.dispatch(cleanupNgrxStorage())
  }


  /* PAGE ACTIONS */
  cloneHandler () {
    this.store.dispatch( cloneScenario( {payload:{id:this.id}}) );
  }
  deleteHandler () {
    this.store.dispatch( deleteScenario( {payload:{id:this.id}}) );
  }
  runHandler () {
    this.title$.pipe(
      take(1)
    ).subscribe(label => {

      this.store.dispatch( runScenario( {payload:{label:label}}) );
    })
  }
  changeFieldHandler ($event, field) {

    let change = {};
    change[field] = $event;

    this.scenario = {
      ...this.scenario,
      ...change
    };
  }
  saveHandler () {

    this.store.dispatch( saveScenario( {payload:{
      scenario: this.scenario
    }}) );
  }


  /* DATA ACTIONS */
  searchHandler ($event: string) {

  }
  openExternalUrlHandler ($event: string) {
    this.navigation.openExternalUrl($event)
  }
  tabSwitchHandler (tab:string) {
    this.currentTab = tab;
  }

  /* SIDEBAR ACTIONS */
  refreshHistoryHandler () {
    this.store.dispatch( refreshScenarioHistory({payload:{id:this.id}}) );
  }
  openJobRecordHandler (jobId:string) {
    this.navigation.openScenarioHistory(jobId)
  }
}
