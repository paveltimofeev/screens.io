import { Component, OnDestroy, OnInit } from '@angular/core';
import { el } from '@angular/platform-browser/testing/src/browser_util';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { accountInfo, viewports, operationCorrelationId } from './store/settings.selectors';
import {
  addCustomViewport,
  cleanupNgrxStorage, operationCompleted,
  refreshAccountInfo,
  refreshViewports,
  updateAccountInfo,
  updatePassword, updateViewports
} from './store/settings.actions';
import { filter, take } from 'rxjs/operators';


const wellknownViewports = {
  desktop: [
    { name: '2560 × 1440' , width: 2560, height: 1440 },
    { name: '1920 × 1080' , width: 1920, height: 1080 },
    { name: '1600 × 900' , width: 1600, height: 900 },
    { name: '1536 × 864' , width: 1536, height: 864 },
    { name: '1366 × 768' , width: 1366, height: 768 },
    { name: '1280 × 1024' , width: 1280, height: 1024 },
    { name: '1024 × 768', width: 1024, height: 768 },
  ],
  mobile: [
    { name: '3200 × 1440 - Galaxy S20',  width: 3200, height: 1440 },
    { name: '2688 × 1242 - iPhone 11 Pro Max',  width: 2688, height: 1242 },
    { name: '2436 × 1125 - iPhone XS',  width: 2436, height: 1125 },
    { name: '2160 × 1080 - LG Q6',  width: 2160, height: 1080 },
    { name: '1600 × 720 - Honor 9A',  width: 1600, height: 720 },
    { name: '1520 × 720 - Xiaomi Redmi 8',  width: 1520, height: 720 },
    { name: '1440 × 720 - Honor 9S',  width: 1440, height: 720 },
    { name: '1334 × 750 - iPhone 8', width: 1334, height: 750 },
  ],
  tablet: [
    { name: '2732 × 2048 - iPad Pro 12.9 (2020)', width: 2732, height: 2048 },
    { name: '2388 × 1668 - iPad Pro 11', width: 2388, height: 1668 },
    { name: '2160 × 1620 - iPad 10.2', width: 2160, height: 1620 },
    { name: '1920 × 1200 - Galaxy Tab A 10.1', width: 1920, height: 1200 },
    { name: '1280 ×  800 - Galaxy Tab A 8.0', width: 1280, height: 800 },
  ]
};


@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit, OnDestroy {

  currentTab: string = 'Account Info';

  accountInfo$: Observable<any>;
  viewports$: Observable<any>;

  viewports: {
    desktop: string[];
    desktop_selected: string[];
    mobile: string[];
    mobile_selected: string[];
    tablet: string[];
    tablet_selected: string[];
    custom: string[];
    createCustomViewport: {
      name?: string,
      width?: number,
      height?: number,
      error?: string
    };
  } = {
    desktop: [],
    desktop_selected: [],
    mobile: [],
    mobile_selected: [],
    tablet: [],
    tablet_selected: [],
    custom: [],
    createCustomViewport: {}
  };

  constructor(
    private store: Store
  ) {}

  ngOnInit() {

    this.accountInfo$ = this.store.pipe(select( accountInfo ));
    this.viewports$ = this.store.pipe(select( viewports ));
    this.store.dispatch( refreshAccountInfo() );
    this.store.dispatch( refreshViewports() );

    this.viewports$.subscribe( viewports => {
      if (viewports.length > 0) {

        this.viewports.desktop_selected = viewports.map(x => x.name);
        this.viewports.mobile_selected = viewports.map(x => x.name);
        this.viewports.tablet_selected = viewports.map(x => x.name);
      }
    });

    this.viewports.desktop = wellknownViewports.desktop.map(x => x.name);
    this.viewports.mobile = wellknownViewports.mobile.map(x => x.name);
    this.viewports.tablet = wellknownViewports.tablet.map(x => x.name);
  }

  ngOnDestroy () {
    this.store.dispatch(cleanupNgrxStorage())
  }

  tabSwitchHandler (tab: string) {
    this.currentTab = tab;
  }

  changedAccountInfo: any = {};
  updatingAccountInfo:boolean = false;
  changeAccountInfoPropHandler ($event: string, prop: string) {
    this.changedAccountInfo[prop] = $event;
  }
  updateAccountInfoHandler () {

    if (!this.updatingAccountInfo) {

      const corId = `${Math.random()}`;

      this.store.pipe(
        select(operationCorrelationId),
        filter(x => x === corId),
        take(1)
      ).subscribe(_ => {
        this.updatingAccountInfo = false;
      });

      this.updatingAccountInfo = true;

      this.store.dispatch(updateAccountInfo({
        payload: {
          accountInfo: this.changedAccountInfo,
          correlationId: corId
        }
      }))
    }
  }

  updatedPassword: any = {};
  updatingPassword: boolean = false;
  updatingPasswordDisabled: boolean = true;
  updatePasswordPropHandler ($event: string, prop: string) {

    this.updatedPassword[prop] = $event;

    this.updatingPasswordDisabled =
      !this.updatedPassword.currentPassword ||
      !this.updatedPassword.newPassword ||
      !this.updatedPassword.confirmNewPassword ||
      this.updatedPassword.newPassword != this.updatedPassword.confirmNewPassword;

    if (this.updatedPassword.newPassword != this.updatedPassword.confirmNewPassword) {
      this.updatedPassword.confirmNewPasswordError = 'Passwords does not match';
    } else {
      this.updatedPassword.confirmNewPasswordError = null;
    }
  }
  updatePasswordHandler() {

    if (!this.updatingPassword && !this.updatingPasswordDisabled) {

      const corId = `${Math.random()}`;

      this.store.pipe(
        select(operationCorrelationId),
        filter(x => x === corId),
        take(1)
      ).subscribe(_ => {
        this.updatingPassword = false;
      });

      this.updatingPassword = true;

      this.store.dispatch(updatePassword({
        payload: {
          updatedPassword: this.updatedPassword,
          correlationId: corId
        }
      }))
    }
  }

  setCustomViewportHandler (prop: string, $event: string) {
    this.viewports.createCustomViewport[prop] = $event;
  }

  selectedViewports:any = {
    desktop: [],
    mobile: [],
    tablet: []
  };

  viewportsChangeHandler (type: string, $event: string[]) {

    this.selectedViewports[type] = $event;
  }

  addViewportHandler () {

    let vp = this.viewports.createCustomViewport;

    this.store.dispatch( addCustomViewport({
      payload: {
        name: `${vp.width} × ${vp.height}`,
        width: +vp.width,
        height: +vp.height
      }
    }));

    let newViewport = `${vp.width} × ${vp.height}`;
    if (vp.name && vp.name !== '') {
      newViewport += `- ${vp.name}`
    }

    if (this.viewports.custom.indexOf(newViewport) == -1) {
      this.viewports.custom.push(newViewport);
      this.viewports.createCustomViewport = {};
    }
    else {
      this.viewports.createCustomViewport.error = `Viewport "${newViewport}" already exists`;
    }
  }

  updatingViewportsList:boolean = false;
  updateViewportsListHandler () {

    if (!this.updatingViewportsList) {

      let desktop = wellknownViewports.desktop.filter(viewport => this.selectedViewports.desktop.find(selected => viewport.name === selected));
      let mobile = wellknownViewports.mobile.filter(viewport => this.selectedViewports.mobile.find(selected => viewport.name === selected));
      let tablet = wellknownViewports.tablet.filter(viewport => this.selectedViewports.tablet.find(selected => viewport.name === selected));

      let corId = `${Math.random()}`;

      this.store.pipe(
        select(operationCorrelationId),
        filter(x => x === corId),
        take(1)
      ).subscribe(() => {
        this.updatingViewportsList = false;
      });

      let payload = {
        correlationId: corId,
        viewports: [
          ...desktop,
          ...mobile,
          ...tablet
        ]
      };

      this.updatingViewportsList = true;
      this.store.dispatch(updateViewports({payload}));
    }
  }
}
