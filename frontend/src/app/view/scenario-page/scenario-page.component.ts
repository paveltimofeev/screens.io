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
  scenarioHistory$: Observable<IScenarioHistory[]>;

  constructor(
    private route: ActivatedRoute,
    private store: Store,
    private navigation: NavigationService
  ) {}

  ngOnInit() {

    this.title$ = this.store.select( title );
    this.scenario$ = this.store.select( scenario );
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
  saveHandler () {
    this.store.dispatch( saveScenario( {payload:{
      scenario:{}
    }}) );
  }

  /* DATA ACTIONS */
  searchHandler ($event: string) {

  }


  /* SIDEBAR ACTIONS */
  refreshHistoryHandler () {
    this.store.dispatch( refreshScenarioHistory({payload:{id:this.id}}) );
  }
  openJobRecordHandler (jobId:string) {
    this.navigation.openScenarioHistory(jobId)
  }
}
