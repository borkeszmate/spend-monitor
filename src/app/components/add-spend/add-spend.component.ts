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

  defaultCostCategories = [
    {
      name: 'Bars and coffee houses',
      img: '../../../assets/img/coffee-cup.png'
    },
    {
      name: 'Grocery',
      img: '../../../assets/img/grocery.svg'
    },
    {
      name: 'Restaurants',
      img: '../../../assets/img/food.svg'
    },
    {
      name: 'Entertainment',
      img: '../../../assets/img/shopping.svg'
    },
    {
      name: 'Transport',
      img: '../../../assets/img/transport.svg'
    },
    {
      name: 'Shopping',
      img: '../../../assets/img/shopping.svg'
    },
    {
      name: 'Services',
      img: '../../../assets/img/coffee-cup.png'
    },
    {
      name: 'Utilities',
      img: '../../../assets/img/house_rental.svg'
    },
    {
      name: 'Vehicle',
      img: '../../../assets/img/vehicle.svg'
    },
  ];

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
