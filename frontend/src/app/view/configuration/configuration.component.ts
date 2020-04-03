import { Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { selectScenarios, selectViewports } from './store/configuration.selectors';
import { refresh } from './store/configuration.actions';

@Component({
  selector: 'app-configuration',
  templateUrl: './configuration.component.html',
  styleUrls: ['./configuration.component.css']
})
export class ConfigurationComponent implements OnInit {

  url:string = "http://localhost";

  viewports$;
  scenarios$;

  constructor(private store: Store) { }

  ngOnInit() {

    this.viewports$ = this.store.pipe(select(selectViewports));
    this.scenarios$ = this.store.pipe(select(selectScenarios));

    this.store.dispatch(refresh());
  }

}
