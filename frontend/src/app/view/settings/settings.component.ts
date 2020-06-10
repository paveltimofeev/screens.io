import { Component, OnDestroy, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import {
  viewports,
  selectedViewports,
  operationResult
} from './store/settings.selectors';
import {
  cleanupNgrxStorage,
  refreshViewports,
  selectViewports,
  updateViewports
} from './store/settings.actions';
import { filter, take } from 'rxjs/operators';
import * as accountSelectors from '../../store/account-api/account-api.selectors';
import {
  deleteAccountOp,
  refreshAccountInfo,
  updateAccountInfoOp,
  updatePasswordOp
} from '../../store/account-api/account-api.actions';


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

  updateAccountInfoError: string;
  updatePasswordError: string;
  deleteAccountError: string;
  updateViewportsError: string;

  constructor(
    private store: Store
  ) {}

  ngOnInit() {

    this.accountInfo$ = this.store.pipe(select( accountSelectors.accountInfo ));
    this.viewports$ = this.store.pipe(select( viewports ));
    this.selectedViewports$ = this.store.pipe(select( selectedViewports ));

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
  updateAccountInfoDisabled:boolean = true;
  updateAccountInfoSuccess: boolean = false;

  changeAccountInfoPropHandler ($event: string, prop: string) {

    this.updateAccountInfoSuccess = false;
    this.updateAccountInfoError = '';

    this.changedAccountInfo[prop] = $event;
    this.updateAccountInfoDisabled = !this.changedAccountInfo.password || this.changedAccountInfo.password.length === 0
  }
  updateAccountInfoHandler () {

    if (!this.updatingAccountInfo && !this.updateAccountInfoDisabled) {

      let corId = this.accountsOp(
        () => {
          this.updatingAccountInfo = true;
          this.updateAccountInfoError = null;
        },
        (result) => {
          this.updatingAccountInfo = false;
          this.updateAccountInfoError = result.error;
          this.updateAccountInfoSuccess = result.success
         }
      );

      this.store.dispatch(updateAccountInfoOp({
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
  updatePasswordSuccess: boolean = false;
  updatePasswordPropHandler ($event: string, prop: string) {

    this.updatePasswordSuccess = false;
    this.updatePasswordError = '';

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

      let corId = this.accountsOp(
        () => {
          this.updatingPassword = true;
          this.updatePasswordError = null;
        },
        (result) => {
          this.updatingPassword = false;
          this.updatePasswordError = result.error;
          this.updatePasswordSuccess = result.success;
        }
      );

      this.store.dispatch(updatePasswordOp({
        payload: {
          currentPassword: this.updatedPassword.currentPassword,
          newPassword: this.updatedPassword.newPassword,
          correlationId: corId
        }
      }))
    }
  }


  viewportsChangeHandler (type: string, $event: string[]) {

    this.updateViewportsSuccess = false;
    this.updateViewportsError = '';

    this.store.dispatch( selectViewports({payload:{viewports: $event }}) );
  }

  updatingViewportsList:boolean = false;
  updateViewportsSuccess:boolean = false;
  updateViewportsListHandler () {

    if (!this.updatingViewportsList) {

      let corId = this.longOp(
        () => {
          this.updatingViewportsList = true;
          this.updateViewportsError = null;
        },
        (result) => {
          console.log(result)
          this.updatingViewportsList = false;
          this.updateViewportsError = result.error;
          this.updateViewportsSuccess = result.success;
        }
       );

      let payload = {
        correlationId: corId,
      };

      this.store.dispatch(updateViewports({payload}));
    }
  }

  deleteAccountPassword: string;
  deleteAccountDisabled: boolean = true;
  deletingAccount: boolean;

  deleteAccountConfirmHandler ($event: string) {
    this.deleteAccountPassword = $event;
    this.deleteAccountDisabled = !($event.length > 0);
  }

  deleteAccountHandler () {

    if (!this.deleteAccountDisabled) {

      const corId = this.accountsOp(
        () => { this.deletingAccount = true; },
        (result) => {
          console.log(result)
          this.deletingAccount = false;
          this.deleteAccountError = result.error;
        })

      this.store.dispatch( deleteAccountOp({
        payload: {
          password: this.deleteAccountPassword,
          correlationId: corId
        }}));
    }
  }

  longOp(before:Function, after):string {

    before();

    let corId = `${Math.random()}`;

    this.store.pipe(
      select(operationResult),
      filter(x => x.correlationId === corId),
      take(1)
    ).subscribe(after);

    return corId;
  }

  accountsOp(before:Function, after):string {

    before();

    let corId = `${Math.random()}`;

    this.store.pipe(
      select(accountSelectors.operationResult),
      filter(x => x.correlationId === corId),
      take(1)
    ).subscribe(after);

    return corId;
  }
}
