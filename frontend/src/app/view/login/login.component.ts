import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ApiAdapterService } from '../../services/api-adapter.service';
import { ActivatedRoute, Router } from '@angular/router';

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

  signUpMode:boolean = false;

  signInForm:any = {
    email: '',
    emailError: null,
    password: '',
    passwordError: null,

    responseError: null
  };

  signUpForm:any = {
    name: null,
    email: null,
    password: null,
    confirmPassword: null
  };

  ngOnInit () {

    this.route.params.subscribe(params => {
      this.signUpMode = params.mode === 'signup';
    })
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

    if (this.signInForm.email && this.signInForm.email.indexOf('@') > -1 && this.signInForm.password) {

      this.signInForm.responseError = null;
      this.signInForm.emailError = null;
      this.signInForm.passwordError = null;

      this.api
        .signin(this.signInForm.email, this.signInForm.password)
        .subscribe(
          (res) => {
            var ss = window.sessionStorage;
            ss.setItem('li', '1');
            this.router.navigate(['/']);
          },
          (err) => {
            console.log(err);
            this.signInForm.responseError = 'Login failed';
          }
        );
    }
    else {

      this.signInForm.responseError = null;
      this.signInForm.emailError = null;
      this.signInForm.passwordError = null;

      this.signInForm.passwordError = !!!this.signInForm.password ? 'Password required' : null;

      let email = this.signInForm.email;

      if (!!!email || email.trim().length === 0) {
        this.signInForm.emailError = 'Email required';
      }
      if (email.trim().length > 0 && (email.trim().length < 5 || email.indexOf('@') < 0)) {
        this.signInForm.emailError = 'Wrong email format';
      }
    }
  }
}
