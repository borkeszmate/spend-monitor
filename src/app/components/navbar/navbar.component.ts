import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {


  isToggled = false;
  menuIcon;
  mobileNav;

  constructor(private Auth: AuthService) { }

  ngOnInit() {
    this.menuIcon = document.querySelector('#menuIcon');
    this.mobileNav = document.querySelector('.opened-navbar');
    // this.mobileNav.style.display = 'none';
    this.mobileNav.style.transform = 'translateX(-100%)';

  this.Auth.afAuth.user.subscribe(user => {
    console.log(user.photoURL);
  });


  }

  public navClick() {

    this.isToggled = !this.isToggled;
    // console.log(this.isToggled);

    if (this.isToggled === false) {

      this.mobileNav.style.transform = 'translateX(-100%)';
    } else {
      // this.mobileNav.style.display = 'block';
      this.mobileNav.style.transform = 'translateX(0)';

    }
  }

  public signOut() {
    this.Auth.signOut();
  }




}
