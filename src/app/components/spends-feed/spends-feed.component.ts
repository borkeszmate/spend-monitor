import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { SpendsService } from '../../services/spends.service';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { AngularFireDatabase } from '@angular/fire/database';
import { User } from '../../interfaces/user';
import { FormGroup, FormControl, Validators } from '@angular/forms';

// Notification
import { NotifierService } from 'angular-notifier';




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
  totalSpend: number;

  user: User = {
    id: '',
    email: '',
    costCategories: []
  };
  editForm: FormGroup;
  editDate;
  EditDateToggler;

  // editedItem = {
  //   amount: null,
  //   category: '',
  //   date: null
  // };

  private readonly notifier: NotifierService;
  constructor(
    private Auth: AuthService,
    private Spends_Service: SpendsService,
    private User_service: UserService,
    private db: AngularFireDatabase,
    private router: Router,
    private notifierService: NotifierService
    ) {
    this.notifier = notifierService;
    }


  ngOnInit() {

    this.Auth.checkIfLoggedIn();
    this.getSpends();
    this.getUser();
    this.editArea = document.querySelector('#edit');
    console.log(this.editArea);
      this.editDate =  document.querySelector('.edit__form__date');
      this.EditDateToggler = document.querySelector('.edit__form__dateToggler');
      this.createEditForm('');


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
        // console.log(this.user);
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
            this.calculateTotalSpend();
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
      this.editDate.style.display = 'none';
      this.EditDateToggler.style.display = 'block';

    } else {
      // Opening
      this.createEditForm(expense);
      this.editArea.style.transform = 'translateX(0)';
      this.openedExpense = expense;

    }
  }

  createEditForm(expense) {
    const time = expense.date;
    this.editForm = new FormGroup({
      amount: new FormControl(expense.amount, [Validators.required]),
      category: new FormControl(expense.category, [Validators.required]),
      date: new FormControl(time, [Validators.required]),
      key: new FormControl(expense.key, [Validators.required])
    });
  }

  toggleEditDate(e) {

    this.editDate.style.display = 'block';
    this.EditDateToggler.style.display = 'none';
  }

  saveEditedExpense() {
    let date = this.editForm.value.date;
    date = new Date(this.editForm.value.date).getTime();
    const key = this.editForm.value.key;
    const editedExpense = {
      amount: this.editForm.value.amount,
      category: this.editForm.value.category,
      date: date,
    };
    // console.log(key);
    this.Spends_Service.editSpendInFirebase(key, editedExpense)
    .then(response => {
      console.log(response);
      this.notifier.notify('success', `
          Great, you have successfully modified your expense!
          `);
      this.editToggle('');
      this.getSpends();
    })
    .catch(err => {
      console.log(err);
      this.notifier.notify('warning', 'Something went wrong. Please, try again!');
    });

  }

  deleteSpend(key) {
    this.Spends_Service.deleteSpendFromFirebase(key)
    .then(response => {
      this.notifier.notify('info', 'Spend succesfully deleted!');
      this.editToggle('');
      this.getSpends();
    })
    .catch(err => {
      this.notifier.notify('warning', 'Something went wrong. Please, try again!');
    } );
  }

  calculateTotalSpend() {
    const allAmounts = [];
    this.expenses.forEach(expense => {
      allAmounts.push(expense.amount);
    });
    this.totalSpend = allAmounts.reduce((acc, item) => {
      return acc += item;
    });
  }

}
