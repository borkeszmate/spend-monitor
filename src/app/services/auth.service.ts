import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { SpendsService } from './spends.service';




@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    public afAuth: AngularFireAuth,
    private router: Router) {}

  token: string;
  isLoggedIn: boolean;
  userdId: string;




  register(email, password) {
    return this.afAuth.auth.createUserWithEmailAndPassword(email, password);

  }

  // login(email: string, password: string) {
  //   this.afAuth.auth.signInWithEmailAndPassword(email, password)
  //   .then(
  //     response => {
  //       //  console.log(response);
  //        this.afAuth.auth.currentUser.getIdToken()
  //        .then(token => {
  //          this.token = token;
  //         //  console.log(this.token);
  //          this.router.navigate(['']);
  //        });
  //       }
  //   );
  // }

  login(email: string, password: string) {
  return  this.afAuth.auth.signInWithEmailAndPassword(email, password);

  }

  signOut() {
    this.isLoggedIn = false;
    this.afAuth.auth.signOut();
  }


  getToken() {

    this.afAuth.authState.subscribe(response => {
      response.getIdTokenResult().then(token => {
        this.token = token.token;
      });
    });
  }

  getUserId(): Observable<any> {
   return this.afAuth.authState;
  }

  getUserIdinOnInit() {
    this.afAuth.authState.subscribe(result => {
      this.userdId = result.uid;
    });
  }




  checkIfLoggedIn() {

    this.afAuth.authState.subscribe(response => {

    const observer = response;
    //  console.log(authState);

       if (observer != null) {
        //  console.log('loggedin');

        this.isLoggedIn = true;
        return true;

       } else {
        //  console.log('off');
         this.isLoggedIn = false;
         this.router.navigate(['login']);
         return false;
       }

     });

  }




}
