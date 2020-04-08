import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ApiAdapterService } from '../../services/api-adapter.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  constructor(private api: ApiAdapterService) { }

  loginHandler (loginForm: NgForm) {

    if (loginForm.valid) {

      this.api
        .login(loginForm.value.user, loginForm.value.password)
        .subscribe(() => console.log('login completed'));
    }
  }

  logoutHandler () {

    this.api
      .logout()
      .subscribe( () => console.log('logout completed'));
  }
}
