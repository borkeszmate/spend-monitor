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
    pieChart;
    pieChartContainer;

    lineChartKeys;
    lineChartValues;
    lineChartContainer;
    lineChart;


  ngOnInit() {
    this.pieChartContainer = document.querySelector('.pieChart');
    this.lineChartContainer = document.querySelector('.lineChart');
    this.getSpends();
    // Watch modofications
    this.Spends_Service.subject.subscribe(response => {
      this.pieChart.destroy();
      this.lineChart.destroy();

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
            this.getDailySpends();

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
      this.getPieChart();
    }
  }

  getDailySpends() {
    const spendByDayArr = [];
    this.expenses.forEach(spend => {
      const spendByDayArrItem = {
        date : '',
        amount : null
      };
      const year = new Date(spend.date).getFullYear();
      const month = new Date(spend.date).getMonth();
      const day = new Date(spend.date).getDate();
      spendByDayArrItem.date = `${year}-${month}-${day}`;
      spendByDayArrItem.amount = spend.amount;


      spendByDayArr.push(spendByDayArrItem);

    });



    const reducedArr = spendByDayArr.reduce((object, item) => {
      const date = item.date;
      const amount = item.amount;

      if (!object.hasOwnProperty(date)) {
        object[date] = 0;
      }
      object[date] += amount;
      return object;
    }, {});
    this.lineChartValues = Object.values(reducedArr);
    this.lineChartKeys = Object.keys(reducedArr);


    if (this.lineChartValues.length > 0) {
      this.getLineChart();
    }


  }




  getPieChart() {
    const options = {
      chart: {
        type: 'donut',
      },
      series: this.pieChartValues,

      labels: this.pieChartKeys


    };

    this.pieChart = new ApexCharts(

      document.querySelector('#chart'),
      options
    );

    this.pieChart.render();
  }



  getLineChart() {
    const options = {
      chart: {
        height: 350,
        type: 'area',
      },
      dataLabels: {
        enabled: true
      },
      stroke: {
        curve: 'smooth'
      },
      series: [{
        name: 'Expenses',
        data: this.lineChartValues
      }],

      xaxis: {
        type: 'datetime',
        categories: this.lineChartKeys,
      },
      tooltip: {
        x: {
          format: 'yy-MM-dd'
        },
      }
    };

    this.lineChart = new ApexCharts(
      document.querySelector('#lineChart'),
      options
    );

    this.lineChart.render();

  }


}
