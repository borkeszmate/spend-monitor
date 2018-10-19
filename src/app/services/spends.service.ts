import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { AngularFireDatabase } from '@angular/fire/database';


@Injectable({
  providedIn: 'root'
})
export class SpendsService {

  constructor(
    private Auth: AuthService,
    private db: AngularFireDatabase
    ) { }

  addSpendToFirebase(spend) {
    return this.db.database.ref(`spends/${this.Auth.userdId}`).push({
      amount: spend.amount,
      date: spend.date,
      category: spend.category,
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
    });
  }
  deleteSpendFromFirebase(key) {
    return this.db.database.ref(`spends/${this.Auth.userdId}/${key}`).remove();
  }


}
