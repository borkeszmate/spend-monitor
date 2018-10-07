import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

// Firebase
import { AngularFireModule } from '@angular/fire';
import { environment } from '../environments/environment';
import { AngularFireAuthModule } from '@angular/fire/auth';

// Components
import { AppComponent } from './app.component';
import { AdminComponent } from './components/admin/admin.component';
import { LoginComponent } from './components/login/login.component';
import { SpendsFeedComponent } from './components/spends-feed/spends-feed.component';

// Services
import { AuthService } from './services/auth.service';
import { PostsServiceService } from './services/posts-service.service';

// Router
import { Routes, RouterModule } from '@angular/router';

// Guard
import { AuthGuard } from './auth/auth.guard';

const routes: Routes = [
  { path: '', component: LoginComponent },
  {  path: 'spends',
     component: SpendsFeedComponent
    //  canActivate: [AuthGuard],
   },
];

@NgModule({
  declarations: [
    AppComponent,
    AdminComponent,
    LoginComponent,
    SpendsFeedComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
    RouterModule.forRoot(routes)
  ],
  providers: [
    AuthService,
    PostsServiceService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
