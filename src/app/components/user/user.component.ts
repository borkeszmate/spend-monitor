import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { User } from '../../interfaces/user';
import { AngularFireDatabase } from '@angular/fire/database';
import { NotifierService } from 'angular-notifier';


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
  private readonly notifier: NotifierService;
  constructor(
    private User_service: UserService,
    private db: AngularFireDatabase,
    private notifierService: NotifierService

    ) {
    this.notifier = notifierService;
    }
  ngOnInit() {

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

  addCategory() {
    if (this.addedCategory != null) {
      const objectToGive = {
        name: this.addedCategory.toString(),
        img: '../../../assets/img/other.svg'
      };
      // console.log(objectToGive);
      this.user.costCategories.push(objectToGive);

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
  }

}
