import { Component, OnDestroy, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import {
  accountInfo,
  viewports,
  selectedViewports,
  operationResult
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

  updateAccountInfoError: string;
  updatePasswordError: string;
  deleteAccountError: string;
  updateViewportsError: string;

  constructor(
    private store: Store
  ) {}

  ngOnInit() {

    this.accountInfo$ = this.store.pipe(select( accountInfo ));
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
  changeAccountInfoPropHandler ($event: string, prop: string) {
    this.changedAccountInfo[prop] = $event;
  }
  updateAccountInfoHandler () {

    if (!this.updatingAccountInfo) {

      let corId = this.longOp(
        () => {
          this.updatingAccountInfo = true;
          this.updateAccountInfoError = null;
        },
        (result) => {
          this.updatingAccountInfo = false;
          this.updateAccountInfoError = result.error;
         }
      );

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

      let corId = this.longOp(
        () => {
          this.updatingPassword = true;
          this.updatePasswordError = null;
        },
        (result) => {
          this.updatingPassword = false;
          this.updatePasswordError = result.error;
        }
      );

      this.store.dispatch(updatePassword({
        payload: {
          currentPassword: this.updatedPassword.currentPassword,
          newPassword: this.updatedPassword.newPassword,
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

      let corId = this.longOp(
        () => {
          this.updatingViewportsList = true;
          this.updateViewportsError = null;
        },
        (result) => {
          console.log(result)
          this.updatingViewportsList = false;
          this.updateViewportsError = result.error;
        }
       );

      let payload = {
        correlationId: corId,
      };

      this.store.dispatch(updateViewports({payload}));
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
}
