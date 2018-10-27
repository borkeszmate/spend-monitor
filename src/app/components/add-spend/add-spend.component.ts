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

  user: User = {
    id: '',
    email: '',
    costCategories: []
  };
  addedCategory;
  isCategoriesLoaded = false;
  isCategoriesEdited = false;
  private readonly notifier: NotifierService;
  defaultCostCategoryNames = [];

  addForm: FormGroup;
  spend: Spend = {
    amount: 0,
    category: '',
    date: 0,
    img: '',
    isDefault: true
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
        this.User_service.defaultCostCategories.forEach(category => {
          // @ts-ignore
          this.defaultCostCategoryNames.push(category.name);

        });
        this.isCategoriesLoaded = true;

      });

    });

// Creating the reactive form
    this.addForm = new FormGroup({
      amount: new FormControl('', [Validators.required]),
      category: new FormControl('', [Validators.required]),
    });
  }



  addSubmit(i) {

    this.spend.amount = this.addForm.value.amount;
    this.spend.category = this.addForm.value.category;
    this.spend.date = new Date().getTime();

    if (this.defaultCostCategoryNames.includes(this.spend.category)) {
      this.spend.img = `../../../assets/img/${this.addForm.value.category}.svg`;
      // this.spend.isDefault = true;

    } else {
      // this.spend.isDefault = false;
      this.spend.img = '../../../assets/img/Other.svg';

    }
    console.log(this.spend);


    this.Spends_Service.addSpendToFirebase(this.spend)
    .then(result => {

      this.notifier.notify('success', `You have successfully added ${this.spend.amount} Ft as ${this.spend.category} cost!`);
    });
  }

  addCategory() {
    if (this.addedCategory != null ) {
      const objectToGive =  {
       name : this.addedCategory.toString(),
       img: '../../../assets/img/Other.svg',
       isDefault: false
      };
      // console.log(objectToGive);
      this.user.costCategories.push(objectToGive);
      this.User_service.saveEditedCategoriesToFirebase(this.user)
        .then((result) => {
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
