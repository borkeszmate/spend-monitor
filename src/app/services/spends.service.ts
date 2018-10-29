import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { AngularFireDatabase } from '@angular/fire/database';
import { Subject, ReplaySubject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class SpendsService {
  subject: Subject<any>;
  constructor(
    private Auth: AuthService,
    private db: AngularFireDatabase
    ) {
    this.subject = new ReplaySubject();
    }

  addSpendToFirebase(spend) {
    return this.db.database.ref(`spends/${this.Auth.userdId}`).push({
      amount: spend.amount,
      date: spend.date,
      category: spend.category,
      img: spend.img
    });
  }

  getSpendsFromFirebase() {
    return this.db.database.ref(`spends/${this.Auth.userdId}`);
  }

  editSpendInFirebase(key, editedSpend) {
    return this.db.database.ref(`spends/${this.Auth.userdId}/${key}`).set({
      amount: editedSpend.amount,
      date: editedSpend.date,
      category: editedSpend.category,
      img: editedSpend.img
    });
  }
  deleteSpendFromFirebase(key) {
    return this.db.database.ref(`spends/${this.Auth.userdId}/${key}`).remove();
  }


}
