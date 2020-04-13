import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ApiAdapterService } from '../../services/api-adapter.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  constructor(private api: ApiAdapterService, private router: Router) { }

  loginHandler (loginForm: NgForm) {

    if (loginForm.valid) {

      this.api
        .login(loginForm.value.user, loginForm.value.password)
        .subscribe(() => {

          this.router.navigate(['/']);
        });
    }
  }

  logoutHandler () {

    this.api
      .logout()
      .subscribe( () => console.log('logout completed'));
  }
}
