import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Spend } from '../../interfaces/spend';

import { NotifierService } from 'angular-notifier';

// Services
import { SpendsService } from '../../services/spends.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-add-spend',
  templateUrl: './add-spend.component.html',
  styleUrls: ['./add-spend.component.scss']
})
export class AddSpendComponent implements OnInit {

  constructor(
    private Spends_Service: SpendsService,
    private Auth: AuthService,
    private notifierService: NotifierService
    ) {
    this.notifier = notifierService;
     }
  private readonly notifier: NotifierService;
  addForm: FormGroup;
  spend: Spend = {
    amount: 0,
    category: '',
    date: 0,
  };

  ngOnInit() {
    this.Auth.checkIfLoggedIn();
    this.Auth.getToken();
    this.Auth.getUserIdinOnInit();

    this.addForm = new FormGroup({
      amount: new FormControl('', [Validators.required]),
      category: new FormControl('', [Validators.required])
    });

  }



  addSubmit() {
    this.spend.amount = this.addForm.value.amount;
    this.spend.category = this.addForm.value.category;
    this.spend.date = new Date().getTime();

    this.Spends_Service.addSpendToFirebase(this.spend)
    .then(result => {
      console.log(this.spend);
      this.notifier.notify('success', `You have successfully added ${this.spend.amount} Ft as ${this.spend.category} cost!`);
    });

  }
}
