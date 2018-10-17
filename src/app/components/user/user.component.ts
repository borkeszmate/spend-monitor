import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { User } from '../../interfaces/user';
import { AngularFireDatabase } from '@angular/fire/database';
import { NotifierService } from 'angular-notifier';
import { AuthService } from '../../services/auth.service';




@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {

  user: User = {
    id: '',
    email: '',
    costCategories: []
  };

  addedCategory;
  isCategoriesLoaded = false;
  isCategoriesEdited = false;

  private readonly notifier: NotifierService;
  constructor(
    private User_service: UserService,
    private Auth: AuthService,
    private db: AngularFireDatabase,
    private notifierService: NotifierService

    ) {
    this.notifier = notifierService;
    }

  ngOnInit() {
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

  }

  addCategory() {
    if (this.addedCategory != null) {
      const objectToGive = {
        name: this.addedCategory.toString(),
        img: '../../../assets/img/other.svg'
      };
      // console.log(objectToGive);
      this.user.costCategories.push(objectToGive);
      this.isCategoriesEdited = true;
      this.notifier.notify('info', `${objectToGive.name} category has been added! Don't forget to save your changes!`);

    } else {
      this.notifier.notify('warning', 'Please, enter a category before submitting!');
    }

  }

  deleteCategory(i) {
    console.log(i);
    // @ts-ignore
    this.notifier.notify('warning',
    // @ts-ignore
     `You have deleted ${this.user.costCategories[i].name } category. Click on save button to save changes!`);
    this.user.costCategories.splice(i, 1);
    this.isCategoriesEdited = true;
  }

  saveCategoryChanges() {
    this.User_service.saveEditedCategoriesToFirebase(this.user)
    .then((result) =>  {
      console.log(result);
      this.notifier.notify('success', `Great, you have successfully saved your changes!`);
    })
    .catch(err => {
      console.log(err);
      this.notifier.notify('err', 'Oops, something went wrong... Please try again!');
    });
  }

}
