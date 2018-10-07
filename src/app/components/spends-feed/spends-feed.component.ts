import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-spends-feed',
  templateUrl: './spends-feed.component.html',
  styleUrls: ['./spends-feed.component.scss']
})
export class SpendsFeedComponent implements OnInit {

  constructor(private Auth: AuthService) { }

  loggedIn;

  ngOnInit() {
    // console.log(this.Auth.isAuthenticated);

     console.log(this.Auth.getToken());


  }

}
