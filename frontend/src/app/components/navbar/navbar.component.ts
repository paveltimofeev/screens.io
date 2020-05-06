import { Component } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {

  isMenuOpened:boolean = false;

  openMenuHandler () {
    this.isMenuOpened = !this.isMenuOpened;
  }
}
