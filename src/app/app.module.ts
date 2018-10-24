import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { NotifierModule } from 'angular-notifier';
import { FormsModule } from '@angular/forms';

// Firebase
import { AngularFireModule } from '@angular/fire';
import { environment } from '../environments/environment';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireDatabase } from '@angular/fire/database';

// Components
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { SpendsFeedComponent } from './components/spends-feed/spends-feed.component';
import { AddSpendComponent } from './components/add-spend/add-spend.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { UserComponent } from './components/user/user.component';
import { ChartComponent } from './components/chart/chart.component';
import { FooterComponent } from './components/footer/footer.component';

// Services
import { AuthService } from './services/auth.service';
import { SpendsService } from './services/spends.service';

// Router
import { Routes, RouterModule } from '@angular/router';

// Angular material and its components
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule, MatCheckboxModule, MatFormFieldModule, MatNativeDateModule, MatInputModule } from '@angular/material';
import { MatDatepickerModule } from '@angular/material/datepicker';


const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {  path: '', component: SpendsFeedComponent},
   {path: 'add', component: AddSpendComponent},
  { path: 'user', component: UserComponent}
];

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SpendsFeedComponent,
    NavbarComponent,
    AddSpendComponent,
    UserComponent,
    ChartComponent,
    FooterComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatNativeDateModule,
    MatDatepickerModule,
    MatInputModule,
    FormsModule,
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
