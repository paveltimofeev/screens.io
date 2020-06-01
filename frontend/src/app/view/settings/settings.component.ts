import { Component, OnDestroy, OnInit } from '@angular/core';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit, OnDestroy {

  currentTab: string = 'Viewports';

  accountInfo: any = {};
  customViewport: any = {};

  constructor() { }

  ngOnInit() {
  }

  ngOnDestroy () {
    //this.store.dispatch(cleanupNgrxStorage())
  }

  tabSwitchHandler (tab: string) {
    this.currentTab = tab;
  }
}
