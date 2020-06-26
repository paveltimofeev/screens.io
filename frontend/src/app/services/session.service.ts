import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ApiAdapterService } from './api-adapter.service';

@Injectable({
  providedIn: 'root'
})
export class SessionService {

  private sessionStorage: any;
  private loggedInKey: string = 'loggedin';
  private loggedInValue: string = 'true';
  private afterLoginUrl:string[] = ['/'];
  private afterLogoutUrl:string[] = ['/account', 'signin'];
  private loginPage:string[] = ['/account', 'signin'];

  constructor (
    private router: Router,
    private api: ApiAdapterService
  ) {
    this.sessionStorage = window.sessionStorage;
  }

  login () {

    this.sessionStorage.setItem(this.loggedInKey, this.loggedInValue);
    this.router.navigate(this.afterLoginUrl);
  }

  logout () {

    this.api
      .signout()
      .subscribe( () => {

        this.sessionStorage.clear();
        this.router.navigate(this.afterLogoutUrl);
      });
  }

  isLoggedIn (): boolean {

    return this.sessionStorage.getItem(this.loggedInKey) === this.loggedInValue;
  }

  navigateLoginPage () {
    this.router.navigate(this.loginPage);
  }
}
