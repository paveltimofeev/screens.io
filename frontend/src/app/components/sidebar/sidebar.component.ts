import { Component, Input, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { selectScenarios, selectViewports } from './store/sidebar.selectors';
import { refresh } from './store/sidebar.actions';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {

  @Input()
  viewports;

  @Input()
  scenarios;

  constructor(){}

  ngOnInit() {
  }
}
