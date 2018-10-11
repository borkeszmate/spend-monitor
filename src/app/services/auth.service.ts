import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';






@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(public afAuth: AngularFireAuth, private router: Router) { }

  token: string;
  isLoggedIn:boolean;




  register(email, password) {
    return this.afAuth.auth.createUserWithEmailAndPassword(email, password);

  }

  login(email: string, password: string) {
    this.afAuth.auth.signInWithEmailAndPassword(email, password)
    .then(
      response => {
        //  console.log(response);
         this.afAuth.auth.currentUser.getIdToken()
         .then(token => {
           this.token = token;
          //  console.log(this.token);
           this.router.navigate(['']);
         });
        }
    )
  }

  signOut() {
    this.afAuth.auth.signOut();
  }
  

  getToken() {

   return this.afAuth.auth.currentUser.getIdToken()
      .then(
        token =>{this.token}
      );


  }

  checkIfLoggedIn() {

   const subscription=   this.afAuth.authState.subscribe(response => { 
    
    const observer = response;
    //  console.log(authState);
     
       if (observer != null) {
        //  console.log('loggedin');
         
        return true;
         
       } else {
        //  console.log('off');
         this.router.navigate(['login']);
         return false;
       }
       
     });
     
  }


}
