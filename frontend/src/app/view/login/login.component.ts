import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { DataAccessService } from '../../services/data-access.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private dataAccess: DataAccessService) { }

  ngOnInit() {
  }

  loginHandler (loginForm: NgForm) {

    if (loginForm.valid) {
      this.dataAccess.post(environment.auth + '/login', {
        user: loginForm.value.user,
        password: loginForm.value.password
      }).subscribe( res => {
        console.log(res)
      })
    }
  }
}
