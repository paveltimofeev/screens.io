import { Component, OnInit, AfterViewInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import {
  selectCurrentScenario,
  selectCurrentScenarioLabel, selectLoading,
  selectScenarios,
  selectViewports
} from './store/configuration.selectors';
import {
  changeCurrentScenario, createScenario, createViewport,
  deleteCurrentScenario,
  refresh,
  updateScenario
} from './store/configuration.actions';
import { NgForm } from '@angular/forms';

/// Materalize global instance
declare var M;

@Component({
  selector: 'app-configuration',
  templateUrl: './configuration.component.html',
  styleUrls: ['./configuration.component.css']
})
export class ConfigurationComponent implements OnInit, AfterViewInit {

  url:string = "http://localhost";

  isLoading$;
  viewports$;
  scenarios$;
  selectedScenario$;
  selectedScenarioLabel$;

  instances;
  modals:any = {};

  constructor(private store: Store) { }

  ngOnInit() {

    this.isLoading$ = this.store.pipe(select(selectLoading));
    this.viewports$ = this.store.pipe(select(selectViewports));
    this.scenarios$ = this.store.pipe(select(selectScenarios));
    this.selectedScenario$ = this.store.pipe(select(selectCurrentScenario));
    this.selectedScenarioLabel$ = this.store.pipe(select(selectCurrentScenarioLabel));

    this.store.dispatch(refresh());
  }

  ngAfterViewInit() {

    let elems = document.querySelectorAll('.modal');
    this.instances = M.Modal.init(elems, {width: '500px'});

    for(let i = 0; i < elems.length; i++) {
     this.modals[elems[i].id] = M.Modal.getInstance(elems[i]);
    }
  }

  addViewportHandler () {
    this.modals.addViewportModal.open();
  }

  addScenarioHandler () {
    this.modals.addScenarioModal.open();
  }

  createScenarioHandler (formRef: NgForm) {

    if (formRef.valid) {
      this.store.dispatch(createScenario(formRef.value))
    }
  }

  createViewportHandler (formRef: NgForm) {
    if (formRef.valid) {
      this.store.dispatch(createViewport(formRef.value))
    }
  }

  selectScenarioHandler ($event: string) {
    this.store.dispatch(changeCurrentScenario({label:$event}));
  }

  saveHandler (formRef: NgForm) {

    if (formRef.valid) {

      const strToArray = (formRef, key) => {

        if (typeof(formRef.value[key]) === "string") {
          formRef.value[key] = formRef.value[key].split(',')
        }

      };

      const skipEmpty = (formRef, key) => {
        formRef.value[key] = (formRef.value[key] || []).filter(x => x !== "")
      }

      strToArray(formRef, 'hideSelectors');
      strToArray(formRef, 'removeSelectors');
      strToArray(formRef, 'clickSelectors');
      strToArray(formRef, 'hoverSelectors');

      skipEmpty(formRef, 'hideSelectors');
      skipEmpty(formRef, 'removeSelectors');
      skipEmpty(formRef, 'clickSelectors');
      skipEmpty(formRef, 'hoverSelectors');

      this.store.dispatch(updateScenario(formRef.value))
    }
    else {
      // TODO: invalid form
    }
  }

  topMenuClickHandler ($event: string) {

    console.log($event);
    if ($event === 'Delete') {
      this.store.dispatch(deleteCurrentScenario());
    }
  }
}
