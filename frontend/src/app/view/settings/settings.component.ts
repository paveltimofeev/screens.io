import { Component, OnDestroy, OnInit } from '@angular/core';
import { el } from '@angular/platform-browser/testing/src/browser_util';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { accountInfo, viewports, operationCorrelationId } from './store/settings.selectors';
import {
  cleanupNgrxStorage,
  refreshAccountInfo,
  refreshViewports,
  updateAccountInfo,
  updatePassword
} from './store/settings.actions';
import { filter, take } from 'rxjs/operators';

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
    mobile: string[];
    tablet: string[];
    custom: string[];
    createCustomViewport: {
      name?: string,
      width?: number,
      height?: number,
      error?: string
    };
  } = {
    desktop: [
      '2560 × 1440',
      '1920 × 1080',
      '1600 × 900',
      '1536 × 864',
      '1366 × 768',
      '1280 × 1024',
      '1024 × 768'
    ],
    mobile: [
      '3200 × 1440 - Galaxy S20',
      '2688 × 1242 - iPhone 11 Pro Max',
      '2436 × 1125 - iPhone XS',
      '2160 × 1080 - LG Q6',
      '1600 × 720 - Honor 9A',
      '1520 × 720 - Xiaomi Redmi 8',
      '1440 × 720 - Honor 9S',
      '1334 × 750 - iPhone 8'
    ],
    tablet: [
      '2732 × 2048 - iPad Pro 12.9 (2020)',
      '2388 × 1668 - iPad Pro 11',
      '2160 × 1620 - iPad 10.2',
      '1920 × 1200 - Galaxy Tab A 10.1',
      '1280 ×  800 - Galaxy Tab A 8.0',
    ],
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

  viewportsChangeHandler (tablet: string, $event: string[]) {

  }

  addViewportHandler () {

    let vp = this.viewports.createCustomViewport;
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
}
