import { Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import {
  selectCurrentScenario,
  selectCurrentScenarioLabel,
  selectScenarios,
  selectViewports
} from './store/configuration.selectors';
import { changeCurrentScenario, refresh } from './store/configuration.actions';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-configuration',
  templateUrl: './configuration.component.html',
  styleUrls: ['./configuration.component.css']
})
export class ConfigurationComponent implements OnInit {

  url:string = "http://localhost";

  viewports$;
  scenarios$;
  selectedScenario$;
  selectedScenarioLabel$;

  constructor(private store: Store) { }

  ngOnInit() {

    this.viewports$ = this.store.pipe(select(selectViewports));
    this.scenarios$ = this.store.pipe(select(selectScenarios));
    this.selectedScenario$ = this.store.pipe(select(selectCurrentScenario));
    this.selectedScenarioLabel$ = this.store.pipe(select(selectCurrentScenarioLabel));

    this.store.dispatch(refresh());
  }

  selectScenario ($event: string) {
    console.log('>>>', $event);
    this.store.dispatch(changeCurrentScenario({label:$event}));
  }

  save (formRef: NgForm) {

    console.log('save', formRef);
    console.log('save form value:', formRef.value);
  }
}
