import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ApiAdapterService } from '../../services/api-adapter.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SessionService } from '../../services/session.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit{

  constructor(
    private api: ApiAdapterService,
    private router: Router,
    private route: ActivatedRoute,
    private session: SessionService
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
    name: '',
    nameError: null,
    email: '',
    emailError: null,
    password: '',
    passwordError: null,
    confirmPassword: '',
    confirmPasswordError: null,

    responseError: null
  };

  ngOnInit () {
    this.route.params.subscribe(params => {
      this.signUpMode = params.mode === 'signup';
    })
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
  validateName (form:{name:string, nameError:string}): boolean {

    form.nameError = null;

    form.nameError = !/^[a-zA-Z0-9]+$/.test(form.name) ? 'Invalid name, please use only letters and digits' : null;
    form.nameError = !form.name ? 'Name required' : form.nameError;
    return form.nameError === null;
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
          (res) => { this.processLoginResponse(res, form); },
          (err) => { this.processLoginError(err, form); }
        );
    }
  }

  signUpButtonHandler () {

    let form = this.signUpForm;
    form.responseError = null;

    const isValidName = this.validateName(form);
    const isValidEmail = this.validateEmail(form);
    const isValidPassword = this.validatePassword(form, 6);
    const isValidPasswordConfirm = this.validatePasswordConfirm(form);

    if (isValidEmail && isValidPassword && isValidPasswordConfirm) {

      this.api
        .signup(form.name, form.email, form.password)
        .subscribe(
          (res) => { this.processLoginResponse(res, form); },
          (err) => { this.processLoginError(err, form); }
        );
    }
  }

  private processLoginResponse(res, form) {

    if (!res.error) {
      this.session.login();
    }
    else {
      form.responseError = res.error;
    }
  }

  private processLoginError(err, form) {
    console.error(err);
    form.responseError = err.message || 'Operation failed';
  }
}
