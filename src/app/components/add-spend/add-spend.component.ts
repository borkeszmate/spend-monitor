import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

// Interfaces
import { User } from '../../interfaces/user';
import { Spend } from '../../interfaces/spend';

// Services
import { SpendsService } from '../../services/spends.service';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';

// Db
import { AngularFireDatabase } from '@angular/fire/database';
// Notification
import { NotifierService } from 'angular-notifier';

@Component({
  selector: 'app-add-spend',
  templateUrl: './add-spend.component.html',
  styleUrls: ['./add-spend.component.scss']
})
export class AddSpendComponent implements OnInit {

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
    {
      name: 'Other',
      img: '../../../assets/img/other.svg'
    }
  ];

  user: User = {
    id: '',
    email: '',
    costCategories: []
  };
  addedCategory;
  isCategoriesLoaded = false;
  isCategoriesEdited = false;
  private readonly notifier: NotifierService;

  addForm: FormGroup;
  spend: Spend = {
    amount: 0,
    category: '',
    date: 0,
  };

  constructor(
    private Spends_Service: SpendsService,
    private Auth: AuthService,
    private User_service: UserService,
    private db: AngularFireDatabase,
    private notifierService: NotifierService
    ) {
    this.notifier = notifierService;
     }


  ngOnInit() {
    // Navigate away if not logged in
    this.Auth.checkIfLoggedIn();

    // Fetching currenct user's data from firebase
    this.User_service.getUserDetailsFromFirebase().subscribe((user) => {
      // Make the initial used object
      this.user.id = user.uid;
      this.db.database.ref(`users/${this.user.id}`).once('value', (snapshot) => {
        // console.log(snapshot.val().email);
        this.user.id = snapshot.val().id;
        this.user.email = snapshot.val().email;
        this.user.costCategories = snapshot.val().costCategories;

        this.isCategoriesLoaded = true;
      });

    });

// Creating the reactive form
    this.addForm = new FormGroup({
      amount: new FormControl('', [Validators.required]),
      category: new FormControl('', [Validators.required])
    });
  }



  addSubmit() {
    this.spend.amount = this.addForm.value.amount;
    this.spend.category = this.addForm.value.category;
    this.spend.date = new Date().getTime();

    this.Spends_Service.addSpendToFirebase(this.spend)
    .then(result => {
      console.log(this.spend);
      this.notifier.notify('success', `You have successfully added ${this.spend.amount} Ft as ${this.spend.category} cost!`);
    });
  }

  addCategory() {
    if (this.addedCategory != null ) {
      const objectToGive =  {
       name : this.addedCategory.toString(),
       img: '../../../assets/img/other.svg'
      };
      // console.log(objectToGive);
      this.user.costCategories.push(objectToGive);
      this.User_service.saveEditedCategoriesToFirebase(this.user)
        .then((result) => {
          console.log(result);
          this.notifier.notify('success', `
          Great, you have successfully added ${objectToGive.name} to your cost categories!
          Remember, you can edit your cost categories under your profile settings.
          `);
        })
        .catch(err => {
          console.log(err);
          this.notifier.notify('err', 'Oops, something went wrong... Please try again!');
        });

    } else {
      this.notifier.notify('warning', 'Please, enter a category before submitting!');
    }


  }
}
