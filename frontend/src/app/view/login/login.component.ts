import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ApiAdapterService } from '../../services/api-adapter.service';
import { ActivatedRoute, Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit{

  constructor(
    private api: ApiAdapterService,
    private router: Router,
    private route: ActivatedRoute
  ){}

  mode$: Observable<string>;

  signInForm:any = {
    email: null,
    password: null
  };

  signUpForm:any = {
    name: null,
    email: null,
    password: null,
    confirmPassword: null
  };

  ngOnInit () {

    this.mode$ = this.route.params.pipe(
      map(params => params.mode)
    )
  }

  signUpButtonHandler (form: NgForm) {

    if (this.signUpForm.name && this.signUpForm.email && this.signUpForm.password) {

      if (this.signUpForm.password === this.signUpForm.confirmPassword) {

        this.api
          .signup(this.signUpForm.name, this.signUpForm.password)
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

          var ss = window.sessionStorage;
          ss.setItem('li', '1');

          this.router.navigate(['/']);
        });
    }
  }

  signoutHandler () {

    this.api
      .signout()
      .subscribe( () => {

        var ss = window.sessionStorage;
        ss.clear();

        console.log('singout completed')
        this.router.navigate(['/account', 'signin']);
      });
  }

  signInButtonHandler () {

    if (this.signInForm.email && this.signInForm.password) {
      this.api
        .signin(this.signInForm.email, this.signInForm.password)
        .subscribe(() => {

          var ss = window.sessionStorage;
          ss.setItem('li', '1');

          this.router.navigate(['/']);
        });
    }
  }
}
