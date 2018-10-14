import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { NotifierModule } from 'angular-notifier';

// Firebase
import { AngularFireModule } from '@angular/fire';
import { environment } from '../environments/environment';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireDatabase } from '@angular/fire/database';

// Components
import { AppComponent } from './app.component';
import { AdminComponent } from './components/admin/admin.component';
import { LoginComponent } from './components/login/login.component';
import { SpendsFeedComponent } from './components/spends-feed/spends-feed.component';
import { AddSpendComponent } from './components/add-spend/add-spend.component';

// Services
import { AuthService } from './services/auth.service';
import { SpendsService } from './services/spends.service';

// Router
import { Routes, RouterModule } from '@angular/router';
import { NavbarComponent } from './components/navbar/navbar.component';



const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {  path: '', component: SpendsFeedComponent},
   {path: 'add', component: AddSpendComponent}
];

@NgModule({
  declarations: [
    AppComponent,
    AdminComponent,
    LoginComponent,
    SpendsFeedComponent,
    NavbarComponent,
    AddSpendComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
    RouterModule.forRoot(routes),
    NotifierModule.withConfig({

    })
  ],
  providers: [
    AngularFireDatabase,
    AuthService,
    SpendsService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
