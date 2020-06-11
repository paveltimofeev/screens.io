import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { NavigationService } from '../../services/navigation.service';
import {
  cleanupNgrxStorage,
  cloneScenario,
  refresh,
  refreshScenarioHistory,
  runScenario, saveScenario, deleteScenario, initNewScenario, createScenario
} from './store/scenario-page.actions';
import { Observable, interval } from 'rxjs';
import { IScenarioHistory } from './store/scenario-page.reducer';
import { title, scenario, scenarioHistory } from './store/scenario-page.selectors';
import { map, take, tap, delay } from 'rxjs/operators';

@Component({
  selector: 'app-scenario-page',
  templateUrl: './scenario-page.component.html',
  styleUrls: ['./scenario-page.component.css']
})
export class ScenarioPageComponent implements OnInit, OnDestroy {

  id: string;
  scenario: any;
  stubRule:{selector:string, value:string} = {selector: '', value: ''};

  routeData: {createMode?: boolean} = {};
  currentTab: string = 'Stab Content';
  // currentTab: string = 'General';

  title$: Observable<string>;
  scenario$: Observable<any>;
  scenarioHistory$: Observable<IScenarioHistory[]>;

  constructor(
    private route: ActivatedRoute,
    private store: Store,
    private navigation: NavigationService
  ) {}

  ngOnInit() {

    this.title$ = this.store.select( title );
    this.scenario$ = this.store.select( scenario );
    this.scenario$.subscribe(scenario => this.scenario = Object.assign({}, scenario));
    this.scenarioHistory$ = this.store.select( scenarioHistory );

    this.route.data.subscribe( data => {
      this.routeData = data;
      this.store.dispatch( initNewScenario() );
    });

    this.route.params.subscribe( params => {

      this.id = params.id;
      if (this.id !== undefined) {
        this.store.dispatch(refresh({payload: {id: this.id}}));
        this.store.dispatch(refreshScenarioHistory({payload: {id: this.id}}));
      }
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

      this.store.dispatch( runScenario( {payload:{id:this.id, label:label}}) );
      //this.store.dispatch( refreshScenarioHistory({payload:{id:this.id}}) );
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
  addStubRuleHandler (stubRule: { selector: string; value: string }) {

    if (!this.scenario.stubInnerTextSelectors) {
      this.scenario = {
        ...this.scenario,
        stubInnerTextSelectors: []
      }
    }

    const rule = Object.assign({}, stubRule);

    this.scenario.stubInnerTextSelectors = [
      ...this.scenario.stubInnerTextSelectors,
      rule
    ];
  }
  saveHandler () {

    this.store.dispatch( saveScenario( {payload:{
      scenario: this.scenario
    }}) );
  }
  createHandler () {

    this.store.dispatch( createScenario( {payload:{
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
  openJobRecordHandler (jobId:string, state:string) {

    if(state === 'Passed' || state === 'Failed') {
      this.navigation.openScenarioHistory(jobId)
    }
  }

}
