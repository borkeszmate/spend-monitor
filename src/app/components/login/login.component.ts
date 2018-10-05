import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
 
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  constructor() { }

  loginForm:FormGroup

  ngOnInit() {
    
    this.loginForm = new FormGroup({
      email: new FormControl(''),
      password: new FormControl(''),
      confirm_password: new FormControl(''),
    });

  }

  public OnSubmit() {
    console.log(this.loginForm);
  }


}
