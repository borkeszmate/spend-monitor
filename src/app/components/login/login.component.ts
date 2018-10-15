import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { AuthService } from '../../services/auth.service';
import { PasswordValidation } from '../../validators/password.validator';
import { NotifierService } from 'angular-notifier';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  constructor(
    private Auth: AuthService,
    private User_service: UserService,
    private router: Router,
    notifierService: NotifierService) {

      this.notifier = notifierService;
    }

  private readonly notifier: NotifierService;

  isLogin = true;

  // Forms
  registerForm: FormGroup;
  loginForm: FormGroup;

  // Register process variables
  registerEmail: string;
  registerPassword: string;

  // Login process variables
  loginEmail: string;
  loginPassword: string;

  // Logged in user credentials
  loginResponse;

  ngOnInit() {

    this.registerForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required] ),
      confirm_password: new FormControl('', [Validators.required]),

    },
    {
      validators: PasswordValidation.MatchPassword
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

    this.Auth.register(this.registerEmail, this.registerPassword).then((response) => {

      this.Auth.login(this.registerEmail, this.registerPassword).then(
        loginResponse => {
          // When user is registered und succesfully signed in
          //  --> Create a user node in the database, navigate to homepage and display a welcome messega
          this.User_service.addUserToFirebase();
          this.router.navigate(['']);
          this.notifier.notify('success', `Hi! You have successfully logged in as ${this.registerEmail}`);
        }
      );
    })
    .catch(err => {
      this.notifier.notify('error', err.message);
    });


  }

  /**
   * loginSubmit
   */
  public loginSubmit() {

    this.loginEmail = this.loginForm.value.email;
    this.loginPassword = this.loginForm.value.password;



    this.Auth.login(this.loginEmail, this.loginPassword).then(
      response => {
        this.router.navigate(['']);
        this.notifier.notify('success', `Hi! You have successfully logged in as ${this.loginEmail}`);
      }
    )
      .catch(err => {
        // console.log(err);
        this.notifier.notify('error', err.message);
      });




  }




}
