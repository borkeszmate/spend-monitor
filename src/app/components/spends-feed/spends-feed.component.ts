import { Component, OnInit, OnChanges, AfterViewInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { SpendsService } from '../../services/spends.service';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';




@Component({
  selector: 'app-spends-feed',
  templateUrl: './spends-feed.component.html',
  styleUrls: ['./spends-feed.component.scss']
})
export class SpendsFeedComponent implements OnChanges, OnInit, AfterViewInit {

  expenses;
  expensesLoaded = false;
  constructor(
    private Auth: AuthService,
    private Spends_Service: SpendsService,
    private router: Router) {

    }
  // Properties


  ngOnChanges() {
  }
  ngOnInit() {

      this.Auth.checkIfLoggedIn();
      this.getSpends();


    }

    ngAfterViewInit() {
    }



  signOut() {
    this.Auth.signOut();
  }



  addSpendRoute() {
    this.router.navigate(['add']);
  }


  getSpends() {
    this.Auth.getUserId().pipe(
      map(response => response)
    )
      .subscribe(
        (value) => {
          this.Auth.userdId = value.uid;

          this.Spends_Service.getSpendsFromFirebase().once('value', (snapshot) => {

            this.expenses = this.snapshotToArray(snapshot);
            this.expensesLoaded = true;
            console.log(this.expenses);
            console.log(this.expensesLoaded);
          });
        },
        (error) => error,
        () => {
          console.log('completed');
        }
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

}
