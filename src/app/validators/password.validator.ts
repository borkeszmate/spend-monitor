import { AbstractControl } from '@angular/forms';
export class PasswordValidation {

  static MatchPassword(registerForm: AbstractControl) {
    let password = registerForm.get('password').value; // to get value in input tag
    let confirm_password = registerForm.get('confirm_password').value; // to get value in input tag
    if (password != confirm_password) {
      console.log('false');
      // return false;
      registerForm.get('confirm_password').setErrors({ MatchPassword: true })
    } else {
      console.log('true');
      return null
    }
  }
}