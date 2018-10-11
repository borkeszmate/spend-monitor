import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Spend } from '../../interfaces/spend';
import { SpendsService } from '../../services/spends.service';

import { AngularFireDatabase } from '@angular/fire/database';

@Component({
  selector: 'app-add-spend',
  templateUrl: './add-spend.component.html',
  styleUrls: ['./add-spend.component.scss']
})
export class AddSpendComponent implements OnInit {

  constructor(
    private Spends_Service: SpendsService,
    private db: AngularFireDatabase
    ) { }

  addForm: FormGroup;

  spend: Spend;

  ngOnInit() {



    this.addForm = new FormGroup({
      amount: new FormControl('', [Validators.required]),
      date: new FormControl(new Date(), [Validators.required]),
      category: new FormControl('', [Validators.required])
    });
  }


  addSubmit() {
    this.spend = this.addForm.value;



  }
}
