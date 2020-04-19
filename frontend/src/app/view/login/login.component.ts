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

  signupHandler (form: NgForm) {

    if (form.valid) {

      if (form.value.password === form.value.passwordRepeat) {

        this.api
          .signup(form.value.user, form.value.password)
          .subscribe(() => {

            this.router.navigate(['/']);
          });
      }
    }
  }

  signinHandler (form: NgForm) {

    if (form.valid) {      
      this.api
        .signin(form.value.user, form.value.password)
        .subscribe(() => {

          this.router.navigate(['/']);
        });
    }
  }

  signoutHandler () {

    this.api
      .signout()
      .subscribe( () => {
        console.log('singout completed')
        this.router.navigate(['/login']);
      });
  }
}
