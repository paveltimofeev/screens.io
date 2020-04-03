import { Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import {
  selectCurrentScenario,
  selectCurrentScenarioLabel,
  selectScenarios,
  selectViewports
} from './store/configuration.selectors';
import { changeCurrentScenario, refresh, updateScenario } from './store/configuration.actions';
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
    this.store.dispatch(changeCurrentScenario({label:$event}));
  }

  f(formRef, key) {

    if (typeof(formRef.value[key] === "string")) {
      formRef.value[key] = formRef.value[key].split(',')
    }
  }

  save (formRef: NgForm) {

    if (formRef.valid) {

      const strToArray = (formRef, key) => {

        if (typeof(formRef.value[key]) === "string") {
          formRef.value[key] = formRef.value[key].split(',')
        }
      };

      strToArray(formRef, 'hideSelectors');
      strToArray(formRef, 'removeSelectors');
      strToArray(formRef, 'clickSelectors');
      strToArray(formRef, 'hoverSelectors');

      this.store.dispatch(updateScenario(formRef.value))
    }
    else {
      // TODO: invalid form
    }
  }
}
