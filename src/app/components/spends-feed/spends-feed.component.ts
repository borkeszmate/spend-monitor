import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { SpendsService } from '../../services/spends.service';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { AngularFireDatabase } from '@angular/fire/database';
import { User } from '../../interfaces/user';
import { FormGroup, FormControl, Validators, FormsModule } from '@angular/forms';

// Notification
import { NotifierService } from 'angular-notifier';
import { getLocaleTimeFormat } from '@angular/common';




@Component({
  selector: 'app-spends-feed',
  templateUrl: './spends-feed.component.html',
  styleUrls: ['./spends-feed.component.scss']
})
export class SpendsFeedComponent implements OnInit {

  // Regular expense proterties
  expenses;
  expensesLoaded = false;
  expensesAdded = false;
  totalSpend: number;
  starterExpenses;

// Expense edit related properties
  openedExpense;
  editToggler = false;
  editArea;

  user: User = {
    id: '',
    email: '',
    costCategories: []
  };

// Date filter related
  editForm: FormGroup;
  editDate;
  EditDateToggler;
  datePickerForm;
  isFilterActive = false;
  filteredExpenses;
  fromDate;
  toDate;

  // Dates
  thisMonthStart: number;
  thisMonthEnd: number;

  lastMonthStart: number;
  lastMonthEnd: number;

  yesterdayStart: number;
  yesterdayEnd: number;

  todayStart: number;
  todayEnd: number;


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
    this.getUser();
    this.getSpends();
    // Create edit area
    this.editArea = document.querySelector('#edit');
    this.editDate =  document.querySelector('.edit__form__date');
    this.EditDateToggler = document.querySelector('.edit__form__dateToggler');
    this.createEditForm('');

    // Create date picker form
    this.createDatePickerForm();

    this.getYesterday();


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

      });

    });

  }




  getSpends() {
    this.Auth.getUserId()
      .subscribe(
        (value) => {
          this.Auth.userdId = value.uid;

          this.Spends_Service.getSpendsFromFirebase().once('value', (snapshot) => {
            if (snapshot.exists()) {
              this.expenses = this.snapshotToArray(snapshot).reverse();
              this.sortByDate(this.expenses);
              this.starterExpenses = this.expenses;
              this.expensesLoaded = true;
              this.calculateTotalSpend(this.expenses);
              this.expensesAdded = true;
              // console.log(this.starterExpenses);

              // Create filtered array if filtetered
              if (this.isFilterActive) {
                this.createFilteredExpensesArray(this.expenses, this.fromDate, this.toDate);
              }

            } else {
              this.expensesLoaded = true;
            }

          });
        },
        (error) => {
          console.log(error);
        },

      );

  }


// Firebase snapshot to array
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




// Edit form
  createEditForm(expense) {
    const time = expense.date;
    this.editForm = new FormGroup({
      amount: new FormControl(expense.amount, [Validators.required]),
      category: new FormControl(expense.category, [Validators.required]),
      date: new FormControl(time, [Validators.required]),
      key: new FormControl(expense.key, [Validators.required])
    });
  }



// Edit form
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

      this.notifier.notify('success', `
          Great, you have successfully modified your expense!
          `);
      this.editToggle('');
      this.getSpends();


      // Emit event to subject in order to trigger instant diagram recalculation
      this.Spends_Service.subject.next();
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
      // Emit event to subject in order to trigger instant diagram recalculation
      this.Spends_Service.subject.next();

    })
    .catch(err => {
      this.notifier.notify('warning', 'Something went wrong. Please, try again!');
    } );
  }




  calculateTotalSpend(expenses) {
    const allAmounts = [];
    expenses.forEach(expense => {
      allAmounts.push(expense.amount);
    });
    this.totalSpend = allAmounts.reduce((acc, item) => {
      return acc += item;
    });
  }



  // Datepicker form
  createDatePickerForm() {
    this.datePickerForm = new FormGroup({
      fromDate : new FormControl('', [Validators.required]),
      toDate: new FormControl('', [Validators.required]),
    });
  }



  datePickerSubmit() {
    this.filteredExpenses = '';
    this.isFilterActive = true;
    this.fromDate = this.datePickerForm.value.fromDate.getTime();
    this.toDate = this.datePickerForm.value.toDate.getTime() + 86399999;

    this.createFilteredExpensesArray(this.expenses, this.fromDate, this.toDate);
    this.sortByDate(this.filteredExpenses);
    if (this.filteredExpenses.length > 0) {

      this.calculateTotalSpend(this.filteredExpenses);
    }

    this.Spends_Service.subject.next();
  }




  createFilteredExpensesArray(expenses, fromDate, toDate) {
    this.filteredExpenses = expenses.filter(expense => {

      return (expense.date >= fromDate && expense.date <= toDate);
    });
  }




  clearDateFilter() {
    // this.filteredExpenses = '';
    this.isFilterActive = false;
  }

  sortByDate(expenses) {
    expenses.sort((a, b) => {
      return b.date - a.date;
    });
  }

// Get dates

  getThisMonth() {
    const date = new Date;
    const actualYear = date.getFullYear();
    const actualMonth = date.getMonth();
    this.thisMonthStart = new Date(actualYear, actualMonth).getTime();
    this.thisMonthEnd = new Date(actualYear, actualMonth).getTime() - 1;
  }
  getLastMonth() {
    const date = new Date;
    const actualYear = date.getFullYear();
    const actualMonth = date.getMonth();
    this.lastMonthStart = new Date(actualYear, actualMonth - 1).getTime();
    this.lastMonthEnd = new Date(actualYear, actualMonth).getTime() - 1;
  }



  getYesterday() {
    const date = new Date;
    const actualYear = date.getFullYear();
    const actualMonth = date.getMonth();
    const actualDay = date.getDate();

    this.yesterdayStart = new Date(actualYear, actualMonth, actualDay - 1).getTime();
    this.yesterdayEnd = new Date(actualYear, actualMonth, actualDay).getTime() - 1;
  }

  getToday() {
    const date = new Date;
    const actualYear = date.getFullYear();
    const actualMonth = date.getMonth();
    const actualDay = date.getDate();

    this.todayStart = new Date(actualYear, actualMonth, actualDay).getTime();
    this.todayEnd = new Date().getTime();
  }





}
