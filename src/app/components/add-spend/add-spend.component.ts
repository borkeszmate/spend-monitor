import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Spend } from '../../interfaces/spend';

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
    private Auth: AuthService
    ) { }

  addForm: FormGroup;
  spend: Spend;

  ngOnInit() {
    this.Auth.checkIfLoggedIn();
    this.Auth.getToken();
    this.Auth.getUserId();

    this.addForm = new FormGroup({
      amount: new FormControl('', [Validators.required]),
      date: new FormControl(new Date(), [Validators.required]),
      category: new FormControl('', [Validators.required])
    });

  }



  addSubmit() {
    this.spend = this.addForm.value;
    this.Spends_Service.addSpendToFirebase(this.spend)
    .then(result => {
      alert('Sikeresen hozzáadva. Később itt szép noti lesz');
    });

  }
}
