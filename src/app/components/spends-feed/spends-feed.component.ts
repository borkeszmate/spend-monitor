import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { SpendsService } from '../../services/spends.service';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { AngularFireDatabase } from '@angular/fire/database';
import { User } from '../../interfaces/user';




@Component({
  selector: 'app-spends-feed',
  templateUrl: './spends-feed.component.html',
  styleUrls: ['./spends-feed.component.scss']
})
export class SpendsFeedComponent implements OnInit {

  // Properties
  expenses;
  openedExpense;
  expensesLoaded = false;
  editToggler = false;
  editArea;

  user: User = {
    id: '',
    email: '',
    costCategories: []
  };
  constructor(
    private Auth: AuthService,
    private Spends_Service: SpendsService,
    private User_service: UserService,
    private db: AngularFireDatabase,
    private router: Router,
    ) {

    }


  ngOnInit() {

      this.Auth.checkIfLoggedIn();
      this.getSpends();
      this.editArea = document.querySelector('.edit');
      this.getUser();


    }



  signOut() {
    this.Auth.signOut();
  }



  addSpendRoute() {
    this.router.navigate(['add']);
  }

  getUser() {
    // Fetching currenct user's data from firebase
    this.User_service.getUserDetailsFromFirebase().subscribe((user) => {
      // Make the initial used object
      this.user.id = user.uid;
      this.db.database.ref(`users/${this.user.id}`).once('value', (snapshot) => {
        // console.log(snapshot.val().email);
        this.user.id = snapshot.val().id;
        this.user.email = snapshot.val().email;
        this.user.costCategories = snapshot.val().costCategories;
        console.log(this.user);
      });

    });

  }


  getSpends() {
    this.Auth.getUserId()
      .subscribe(
        (value) => {
          this.Auth.userdId = value.uid;

          this.Spends_Service.getSpendsFromFirebase().once('value', (snapshot) => {

            this.expenses = this.snapshotToArray(snapshot);
            this.expensesLoaded = true;
            // console.log(this.expenses);
            // console.log(this.expensesLoaded);
          });
        },
        (error) => error,

      );

  }

  snapshotToArray(snapshot) {
    const returnArr = [];

    snapshot.forEach( (childSnapshot) => {
      const item = childSnapshot.val();
      item.key = childSnapshot.key;
      returnArr.push(item);
    });

    return returnArr;
  }

  // Edit feed

   editToggle(expense) {
    this.editToggler = !this.editToggler;

    if (this.editToggler === false) {
      // Closing
      this.editArea.style.transform = 'translateX(100%)';

    } else {
      // Opening
      this.editArea.style.transform = 'translateX(0)';
      this.openedExpense = expense;


    }
  }

}
