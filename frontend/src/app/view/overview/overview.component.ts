import { Component, OnDestroy, OnInit } from '@angular/core';
import { IBarItem } from '../../ui-kit/widget-timeline/widget-timeline.component';
import { Observable } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { favoriteScenarios, recentJobs, stats } from './store/overview.selectors';
import { cleanupNgrxStorage, refresh } from './store/overview.actions';
import { NavigationService } from 'src/app/services/navigation.service';
import { runOneScenario } from '../dashboard/store/dashboard.actions';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.css']
})
export class OverviewComponent implements OnInit, OnDestroy {

  favoriteScenarios$: Observable<any[]>;
  recentJobs$: Observable<any[]>;
  stats$: Observable<any>;

  refresher$: Observable<any>;

  constructor(private store: Store, private navigation:NavigationService) { }

  ngOnInit() {

    this.favoriteScenarios$ = this.store.pipe(select(favoriteScenarios))
    this.recentJobs$ = this.store.pipe(select(recentJobs))
    this.stats$ = this.store.pipe(select(stats))

    this.store.dispatch(refresh())

    this.makeStubChart();
  }

  ngOnDestroy () {
    this.store.dispatch(cleanupNgrxStorage())
  }

  openScenarioHandler (scenarioId:string) {
    this.navigation.openScenario(scenarioId);
  }

  openScenarioHistoryHandler (scenarioId:string) {
    this.navigation.openScenarioHistory(scenarioId);
  }

  runScenarioHandler (scenarioLabel:string) {
    console.log('runScenarioHandler', scenarioLabel)
    // api action 'run one scenario' ?
    this.store.dispatch(runOneScenario({label:scenarioLabel}))
  }



  weeklyPassed:IBarItem[] = [];
  makeStubChart () {

    const count = Math.floor(Math.random() * 30);
    for (let i =0; i< count; i++) {
      let val = Math.floor(Math.random() * 100);
      this.weeklyPassed.push({
        percent: val,
        highlighted: val >= 80,
        tooltip: `${val}%`
      })
    }
  }

  testEventHandler(event) {
    console.log(event)
  }
}
