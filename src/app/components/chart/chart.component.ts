import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { SpendsService } from '../../services/spends.service';
import ApexCharts from 'apexcharts';


@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss']
})
export class ChartComponent implements OnInit {

  constructor(
    private Auth: AuthService,
    private Spends_Service: SpendsService,
  ) { }
    showChart = false;
    expenses;
    pieChartKeys;
    pieChartValues;
    pieChartContainer;
    chart;



  ngOnInit() {
    this.pieChartContainer = document.querySelector('.pieChart');
    this.getSpends();
    // Watch modofications
    this.Spends_Service.subject.subscribe(response => {
      this.chart.destroy();
      console.log('kap adatot');
      this.getSpends();
    });
  }

  getSpends() {
    this.Auth.getUserId()
      .subscribe(
        (value) => {
          this.Auth.userdId = value.uid;

          this.Spends_Service.getSpendsFromFirebase().once('value', (snapshot) => {

            this.expenses = this.snapshotToArray(snapshot);
            this.getCategorySum();

          });
        },
        (error) => error,

      );

  }

  snapshotToArray(snapshot) {
    const returnArr = [];

    snapshot.forEach((childSnapshot) => {
      const item = childSnapshot.val();
      item.key = childSnapshot.key;
      returnArr.push(item);
    });

    return returnArr;
  }

  getChart() {
    const options = {
      chart: {
        type: 'donut',
      },
      series: this.pieChartValues,

      labels: this.pieChartKeys


    };

    this.chart = new ApexCharts (

      document.querySelector('#chart'),
      options
    );

    this.chart.render();
  }

  getCategorySum() {
    const expensesArr = [];
    this.expenses.forEach(expense => {
     const amount = {
       category: '',
       amount : ''
     };
     amount.category = expense.category;
     amount.amount = expense.amount;
     expensesArr.push(amount);
    });


    const reducedArr = expensesArr.reduce((object, item) => {
      const category = item.category;
      const amount = item.amount;
      if (!object.hasOwnProperty(category)) {
        object[category] = 0;
        // console.log(object);
      }
      object[category] += amount;
      return object;
    }, {});


    this.pieChartKeys = Object.keys(reducedArr);
    this.pieChartValues = Object.values(reducedArr);
    if (this.pieChartValues.length > 0) {
      console.log(this.pieChartValues);
      this.getChart();
    }
  }


}
