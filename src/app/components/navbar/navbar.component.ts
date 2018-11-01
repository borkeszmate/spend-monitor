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
  isProfilePicAvailable = false;
  profilePic;

  constructor(private Auth: AuthService) { }

  ngOnInit() {
    this.menuIcon = document.querySelector('#menuIcon');
    this.mobileNav = document.querySelector('.opened-navbar');
    // this.mobileNav.style.display = 'none';
    this.mobileNav.style.transform = 'translateX(-100%)';
    this.getProfilePic();





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

  getProfilePic() {
    this.Auth.afAuth.user.subscribe(user => {

      if (user.photoURL != null) {
        this.isProfilePicAvailable = true;
        this.profilePic = user.photoURL;
      }
    });
  }




}
