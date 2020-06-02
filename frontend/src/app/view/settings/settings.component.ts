import { Component, OnDestroy, OnInit } from '@angular/core';
import { el } from '@angular/platform-browser/testing/src/browser_util';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit, OnDestroy {

  currentTab: string = 'Account Info';

  accountInfo: any = {};
  updatePassword: any = {};

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


  constructor() { }

  ngOnInit() {
  }

  ngOnDestroy () {
    //this.store.dispatch(cleanupNgrxStorage())
  }

  tabSwitchHandler (tab: string) {
    this.currentTab = tab;
  }

  setCustomViewportHandler (prop: string, $event: string) {
    this.viewports.createCustomViewport[prop] = $event;
  }

  viewportsChangeHandler (tablet: string, $event: string[]) {

  }

  changeAccountInfoHandler ($event: string, confirmPassword: string) {

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

  updatePasswordHandler ($event: string, prop: string) {

    this.updatePassword[prop] = $event;

    if (this.updatePassword.newPassword
      != this.updatePassword.confirmNewPassword) {
      this.updatePassword.confirmNewPasswordError = 'Passwords does not match';
    } else {
      this.updatePassword.confirmNewPasswordError = null;
    }
  }
}
