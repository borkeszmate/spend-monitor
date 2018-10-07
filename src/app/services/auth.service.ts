import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';

import { Observable, of } from 'rxjs';





@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(public afAuth: AngularFireAuth, private router: Router) { }

  token: string;
  isAuthenticated;



  register(email, password) {
    return this.afAuth.auth.createUserWithEmailAndPassword(email, password);

  }

  login(email: string, password: string) {
      this.afAuth.auth.signInWithEmailAndPassword(email, password)
      .then(response => {
        this.afAuth.idTokenResult.subscribe( (result => {
          this.token = result.token;
          console.log(this.token);
          this.isAuthenticated = true;
          this.router.navigate(['spends']);

        }));
      })
      .catch(err => console.log(err));


  }

  getToken() {


return  this.afAuth.idTokenResult.subscribe(
      (response) => {
        if (response != null) {
          console.log('bejelentkezve');
          // this.isAuthenticated = true;
          this.isAuthenticated = true;

        } else {
          console.log('kurvára nincs bejelentkezve');
          // this.isAuthenticated = false;
          this.isAuthenticated = false;
        }
      }

      );

  }

  getCredentials() {
    this.afAuth.idTokenResult.toPromise();
  }


}
