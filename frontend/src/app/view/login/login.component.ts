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

  signUpMode:boolean = true;

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
    emailError: null,
    password: null,
    passwordError: null,
    confirmPassword: null,
    confirmPasswordError: null,

    responseError: null
  };

  ngOnInit () {
    this.route.params.subscribe(params => {
      this.signUpMode = params.mode === 'signup';
    })
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

        this.router.navigate(['/account', 'signin']);
      });
  }

  isValidEmailFormat (email:string): boolean {

    return email && !email.trim().match(/^.+@.+\..+$/)
  }
  validateEmail (form:{email:string, emailError:string}): boolean {

    let email = form.email;
    form.emailError = null;

    if (!!!email || email.trim().length === 0) {
      form.emailError = 'Email required';
    }
    else if ( this.isValidEmailFormat(email) ) {
      form.emailError = 'Wrong email format';
    }

    return form.emailError === null;
  }
  validatePassword (form:{password:string, passwordError:string}, minLength?:number): boolean {

    form.passwordError = null;

    form.passwordError = !!!form.password ? 'Password required' : null;

    if (minLength) {
      form.passwordError = form.password && form.password.trim().length < minLength ?
        'Your password must be at least 6 characters' :
        form.passwordError;
    }

    return form.passwordError === null;
  }
  validatePasswordConfirm (form:{password:string, confirmPassword:string, confirmPasswordError:string}): boolean {

    form.confirmPasswordError = null;

    form.confirmPasswordError = form.password !== form.confirmPassword ? 'Passwords does not match' : null;
    return form.confirmPasswordError === null;
  }

  signInButtonHandler () {

    let form = this.signInForm;
    form.responseError = null;

    const isValidEmail = this.validateEmail(form);
    const isValidPassword = this.validatePassword(form);

    if (isValidEmail && isValidPassword) {


      this.api
        .signin(form.email, form.password)
        .subscribe(
          (res) => {
            var ss = window.sessionStorage;
            ss.setItem('li', '1');
            this.router.navigate(['/']);
          },
          (err) => {
            console.error(err);
            form.responseError = 'Login failed';
          }
        );
    }
  }

  signUpButtonHandler () {

    let form = this.signUpForm;
    form.responseError = null;

    const isValidEmail = this.validateEmail(form);
    const isValidPassword = this.validatePassword(form, 6);
    const isValidPasswordConfirm = this.validatePasswordConfirm(form);

    if (isValidEmail && isValidPassword && isValidPasswordConfirm) {

      this.api
        .signup(form.name, form.password)
        .subscribe(
          () => {
            this.router.navigate(['/']);
          },
          (err) => {
            console.error(err);
            form.responseError = 'Operation failed';
          });
    }
  }
}
