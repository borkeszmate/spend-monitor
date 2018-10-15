import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { AuthService } from './auth.service';
import { User } from '../interfaces/user';


@Injectable({
  providedIn: 'root'
})
export class UserService {

  defaultCostCategories = [
    'Bars and drinking',
    'Grocery', 'Restaurants',
    'Entertainment',
    'Transport',
    'Shopping',
    'Services',
    'Utilities'
  ];

  initUser: User = {
    id : '',
    email : '',
    costCategories: []
  };

  constructor(
    private db: AngularFireDatabase,
    private Auth: AuthService
    ) {}

  addUserToFirebase() {
    return this.Auth.getUserId().subscribe((user) => {
      // Make the initial used object
      this.initUser.id = user.uid;
      this.initUser.email = user.email;
      this.initUser.costCategories = this.defaultCostCategories;
      // Upload to the db.
      this.db.database.ref(`users/${this.initUser.id}`).set(this.initUser);
    });
  }
}
