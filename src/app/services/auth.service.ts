import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { auth } from 'firebase/app';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(public afAuth: AngularFireAuth) { }

  register(email, password) {
    return this.afAuth.auth.createUserWithEmailAndPassword(email, password);

  }

  login(email, password) {
    return this.afAuth.auth.signInAndRetrieveDataWithEmailAndPassword(email, password);
  }

}
