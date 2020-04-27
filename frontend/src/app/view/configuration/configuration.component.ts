import { Component, OnInit, AfterViewInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import {
  selectCurrentScenario,
  selectCurrentScenarioLabel,
  selectCurrentScenarioHistory,
  selectLoading,
  selectScenarios,
  selectViewports
} from './store/configuration.selectors';
import {
  createScenario, createViewport,
  deleteCurrentScenario, deleteViewport,
  refresh,
  updateScenario,
  cloneCurrentScenario, favoriteCurrentScenario
} from './store/configuration.actions';
import { NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NavigationService } from '../../services/navigation.service';

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
  currentScenarioHistory$;

  instances;
  modals:any = {};

  constructor(
    private store: Store,
    private route: ActivatedRoute,
    private navigation: NavigationService)
  {}

  ngOnInit() {

    this.isLoading$ = this.store.pipe(select(selectLoading));
    this.viewports$ = this.store.pipe(select(selectViewports));
    this.scenarios$ = this.store.pipe(select(selectScenarios));
    this.selectedScenario$ = this.store.pipe(select(selectCurrentScenario));
    this.selectedScenarioLabel$ = this.store.pipe(select(selectCurrentScenarioLabel));
    this.currentScenarioHistory$ = this.store.pipe(select(selectCurrentScenarioHistory));

    this.route.params.subscribe( params => {
      this.store.dispatch(refresh({payload: {id: params.id}}));
    })
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

  removeViewportHandler($event) {
    this.store.dispatch(deleteViewport({label:$event}))
  }

  addScenarioHandler () {
    this.modals.addScenarioModal.open();
  }

  createScenarioHandler (formRef: NgForm) {

    if (formRef.valid) {
      this.store.dispatch(createScenario({payload:formRef.value}))
    }
  }

  createViewportHandler (formRef: NgForm) {
    if (formRef.valid) {
      this.store.dispatch(createViewport(formRef.value))
    }
  }

  selectScenarioHandler ($event: {_id:string}) {

    this.navigation.openScenario($event._id);

    // this.store.dispatch(changeCurrentScenario({scenario:$event}));
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

      strToArray(formRef, 'selectors');
      strToArray(formRef, 'hideSelectors');
      strToArray(formRef, 'removeSelectors');
      strToArray(formRef, 'clickSelectors');
      strToArray(formRef, 'hoverSelectors');

      skipEmpty(formRef, 'selectors');
      skipEmpty(formRef, 'hideSelectors');
      skipEmpty(formRef, 'removeSelectors');
      skipEmpty(formRef, 'clickSelectors');
      skipEmpty(formRef, 'hoverSelectors');

      this.store.dispatch(updateScenario( {payload:formRef.value} ))
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
    else if($event === 'Clone') {
      this.store.dispatch(cloneCurrentScenario())
    }
    else if($event === 'Add to Fav' || $event === 'Remove Fav') {
      this.store.dispatch(favoriteCurrentScenario())
    }
  }
}
