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
      name: 'Bars',
      img: '../../../assets/img/Bars.svg'
    },
    {
      name: 'Grocery',
      img: '../../../assets/img/Grocery.svg'
    },
    {
      name: 'Restaurants',
      img: '../../../assets/img/Food.svg'
    },
    {
      name: 'Transport',
      img: '../../../assets/img/Transport.svg'
    },
    {
      name: 'Shopping',
      img: '../../../assets/img/Shopping.svg'
    },
    {
      name: 'Services',
      img: '../../../assets/img/Services.svg'
    },
    {
      name: 'Utilities',
      img: '../../../assets/img/Utilities.svg'
    },
    {
      name: 'Vehicle',
      img: '../../../assets/img/Vehicle.svg'
    },
    {
      name: 'Education',
      img: '../../../assets/img/Education.svg'
    }
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

  // getUserDetailsFromFirebase () {
  //   return this.Auth.getUserId().subscribe((user) => {
  //     // Make the initial used object
  //     this.initUser.id = user.uid;
  //     this.db.database.ref(`users/${this.initUser.id}`).once('value', (snapshot) => {
  //       // console.log(snapshot.val().email);
  //       this.initUser.id = snapshot.val().id;
  //       this.initUser.email = snapshot.val().email;
  //       this.initUser.costCategories = snapshot.val().costCategories;
  //       return this.initUser;
  //     });

  //   });

  // }

  getUserDetailsFromFirebase() {
    return this.Auth.getUserId();
  }

  saveEditedCategoriesToFirebase(user) {
  return this.db.database.ref(`users/${user.id}`).set({
    id : user.id,
    email: user.email,
    costCategories : user.costCategories
    });
  }

  checkIfUserExist(id) {
    this.db.database.ref(`users/${id}`).once('value', (snapshot) => {
      if (snapshot.exists()) {
        return true;
      } else {
        return false;
      }
    });
  }

}
