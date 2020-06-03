import { Component, OnDestroy, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import {
  accountInfo,
  viewports,
  selectedViewports,
  operationCorrelationId, updateViewportsError
} from './store/settings.selectors';
import {
  addCustomViewport,
  cleanupNgrxStorage,
  refreshAccountInfo,
  refreshViewports,
  selectViewports,
  updateAccountInfo,
  updatePassword, updateViewports
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
  selectedViewports$: Observable<any>;
  updateViewportsError$: Observable<string>;

  constructor(
    private store: Store
  ) {}

  ngOnInit() {

    this.accountInfo$ = this.store.pipe(select( accountInfo ));
    this.viewports$ = this.store.pipe(select( viewports ));
    this.selectedViewports$ = this.store.pipe(select( selectedViewports ));
    this.updateViewportsError$ = this.store.pipe(select( updateViewportsError ));

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


  viewportsChangeHandler (type: string, $event: string[]) {

    this.store.dispatch( selectViewports({payload:{viewports: $event }}) );
  }

  updatingViewportsList:boolean = false;
  updateViewportsListHandler () {

    if (!this.updatingViewportsList) {

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
      };

      this.updatingViewportsList = true;
      this.store.dispatch(updateViewports({payload}));
    }
  }
}
