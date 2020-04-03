import { Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { selectScenarios, selectViewports } from './store/sidebar.selectors';
import { refresh } from './store/sidebar.actions';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {

  viewports$;
  scenarios$;

  constructor(
    private store: Store
  ){}

  ngOnInit() {

    this.viewports$ = this.store.pipe(select(selectViewports));
    this.scenarios$ = this.store.pipe(select(selectScenarios));

    this.store.dispatch(refresh());
  }

}
