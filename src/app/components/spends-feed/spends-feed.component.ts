import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';



@Component({
  selector: 'app-spends-feed',
  templateUrl: './spends-feed.component.html',
  styleUrls: ['./spends-feed.component.scss']
})
export class SpendsFeedComponent implements OnInit {

  constructor(private Auth: AuthService, public afAuth: AngularFireAuth, private router: Router) { }


  ngOnInit() {

this.Auth.checkIfLoggedIn();


  }

  signOut() {
    this.Auth.signOut();
  }

  addSpendRoute() {
    this.router.navigate(['add']);
  }

}
