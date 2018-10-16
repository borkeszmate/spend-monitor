import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { AuthService } from './auth.service';
import { User } from '../interfaces/user';


@Injectable({
  providedIn: 'root'
})
export class UserService {

  defaultCostCategories = [
    {
      name: 'Bars and coffee houses',
      img: '../../../assets/img/coffee-cup.png'
    },
    {
      name: 'Grocery',
      img: '../../../assets/img/grocery.svg'
    },
    {
      name: 'Restaurants',
      img: '../../../assets/img/food.svg'
    },
    {
      name: 'Entertainment',
      img: '../../../assets/img/shopping.svg'
    },
    {
      name: 'Transport',
      img: '../../../assets/img/transport.svg'
    },
    {
      name: 'Shopping',
      img: '../../../assets/img/shopping.svg'
    },
    {
      name: 'Services',
      img: '../../../assets/img/coffee-cup.png'
    },
    {
      name: 'Utilities',
      img: '../../../assets/img/house_rental.svg'
    },
    {
      name: 'Vehicle',
      img: '../../../assets/img/vehicle.svg'
    },
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
