import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  constructor(private Auth: AuthService) { }



  isLogin = false;

  // Forms
  registerForm: FormGroup;
  loginForm: FormGroup;

  // Register process variables
  registerEmail: string;
  registerPassword: string;

  // Login process variables
  loginEmail: string;
  loginPassword: string;

  ngOnInit() {

    this.registerForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required] ),
      confirm_password: new FormControl('', [Validators.required]),
    });


    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required])
    });


  }

  public loginRegisterToggler() {
    this.isLogin = !this.isLogin;
  }


  /**
   * registerSubmit
   */
  public registerSubmit() {

    this.registerEmail = this.registerForm.value.email;
    this.registerPassword = this.registerForm.value.password;

    this.Auth.register(this.registerEmail, this.registerPassword).then(response => console.log(response))
    .catch(err => console.log(err));

  }

  /**
   * loginSubmit
   */
  public loginSubmit() {

    this.loginEmail = this.loginForm.value.email;
    this.loginPassword = this.loginForm.value.password;

    this.Auth.login(this.loginEmail, this.loginPassword)
    .then(response => console.log(response))
    .catch(err => console.log(err));
  }



}
