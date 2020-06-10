import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { refreshAccountInfo } from '../../store/account-api/account-api.actions';
import { Observable } from 'rxjs';
import { IAccountInfo } from '../../store/account-api/account-api.models';
import { accountInfo } from '../../store/account-api/account-api.selectors';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit{

  accountInfo$: Observable<IAccountInfo>;

  isMenuOpened:boolean = false;

  constructor (private store:Store) {}

  ngOnInit (): void {

    this.accountInfo$ = this.store.select(accountInfo);
    this.store.dispatch( refreshAccountInfo() );
  }

  openMenuHandler () {
    this.isMenuOpened = !this.isMenuOpened;
  }
}
