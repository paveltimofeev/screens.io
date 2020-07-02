import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { SessionService } from '../services/session.service';

@Injectable()
export class LoggedIn implements CanActivate {

  constructor(private router: Router, private session: SessionService) {}

  canActivate(): Observable<boolean|UrlTree>|Promise<boolean|UrlTree>|boolean|UrlTree {

    const loggedIn = this.session.isLoggedIn();

    if (!loggedIn) {
      this.session.logout()
      this.session.navigateLoginPage()
    }

    return loggedIn;
  }
}
