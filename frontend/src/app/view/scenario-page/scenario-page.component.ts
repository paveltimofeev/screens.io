import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { NavigationService } from '../../services/navigation.service';
import {
  cleanupNgrxStorage,
  cloneScenario,
  refresh,
  refreshScenarioHistory,
  runScenario,
  saveScenario,
  deleteScenario,
  initNewScenario,
  createScenario,
  removeScenarioArrayValue,
  setScenarioProp,
  resetScenarioArrayValue
} from './store/scenario-page.actions';
import { Observable } from 'rxjs';
import { title, scenario, scenarioHistory } from './store/scenario-page.selectors';
import { take } from 'rxjs/operators';
import { IScenarioHistory } from '../../models/app.models';

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
  currentTab: string = 'General';

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
    this.scenario$.subscribe(scenario => this.scenario = scenario);
    this.scenarioHistory$ = this.store.select( scenarioHistory );

    this.route.queryParams.subscribe(queryParams => {

      if ([
        'General',
        'Elements Selectors',
        'Viewports',
        'Authorization',
        'Wait Loading',
        'Page Modification',
        'Stub Content',
        'Interaction',
        'Notifications',
        'Scheduler'
      ].indexOf(queryParams.tab) > -1 ) {
        this.currentTab = queryParams.tab;
      }
    });

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

  changeFieldHandler ($event: string, field: string, parentField:string = null) {

    this.store.dispatch( setScenarioProp({payload:
        {
          field,
          parentField,
          value: $event
        }}))
  }
  addStubRuleHandler (stubRule: { selector: string; value: string }) {

    this.store.dispatch( setScenarioProp({payload:
        {
          field: 'stubContentRules',
          value: Object.assign({}, stubRule),
          isArray: true
        }}))
  }
  removeStubRuleHandler (index: number) {

    this.store.dispatch( removeScenarioArrayValue({payload:
        {
          field: 'stubContentRules',
          index
        }}))
  }
  removeAllStubRulesHandler () {

    this.store.dispatch( resetScenarioArrayValue(
      {payload: { field: 'stubContentRules' }}))
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
