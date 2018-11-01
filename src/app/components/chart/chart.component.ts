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
    expenses;
    pieChartKeys;
    pieChartValues;
    pieChart;
    pieChartContainer;
    chartsContainer;

    lineChartKeys;
    lineChartValues;
    lineChartContainer;
    lineChart;


  ngOnInit() {
    this.pieChartContainer = document.querySelector('.pieChart');
    this.lineChartContainer = document.querySelector('.lineChart');
    this.chartsContainer = document.querySelector('.chartsContainer');
    // this.getSpends();
    // Watch modofications
    this.Spends_Service.subject.subscribe(response => {

      if (response === null ) {


        this.chartsContainer.style.display = 'none';

      } else {


        if (this.pieChart || this.lineChart) {
          this.pieChart.destroy();
          this.lineChart.destroy();
        }

        this.expenses = response;
        this.chartsContainer.style.display = 'block';
        this.getCategorySum();
        this.getDailySpends();
      }

    });

  }

  // getSpends() {
  //   this.Auth.getUserId()
  //     .subscribe(
  //       (value) => {
  //         this.Auth.userdId = value.uid;

  //         this.Spends_Service.getSpendsFromFirebase().once('value', (snapshot) => {

  //           this.expenses = this.snapshotToArray(snapshot);
  //           this.getCategorySum();
  //           this.getDailySpends();

  //         });
  //       },
  //       (error) => error,

  //     );

  // }

  // snapshotToArray(snapshot) {
  //   const returnArr = [];

  //   snapshot.forEach((childSnapshot) => {
  //     const item = childSnapshot.val();
  //     item.key = childSnapshot.key;
  //     returnArr.push(item);
  //   });

  //   return returnArr;
  // }



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
    let spendByDayArr = [];
    this.expenses.forEach(spend => {
      const spendByDayArrItem = {
        date : '',
        amount : null,
        millisecs : spend.date
      };
      const year = new Date(spend.date).getFullYear();
      const month = new Date(spend.date).getMonth();
      const day = new Date(spend.date).getDate();

      spendByDayArrItem.date = `${year}-${month}-${day}`;
      spendByDayArrItem.amount = spend.amount;


      spendByDayArr.push(spendByDayArrItem);




    });


    spendByDayArr = spendByDayArr.sort((a, b) => {
      return a.millisecs - b.millisecs;
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




    this.lineChartKeys = Object.keys(reducedArr);
    this.lineChartValues = Object.values(reducedArr);
    // console.log(this.lineChartValues);

    if (this.lineChartValues.length > 0) {
      this.getLineChart();
    }


  }




  getPieChart() {
    const options = {
      chart: {
        type: 'donut',
      },

      colors: ['#8BC34A', '#519657', '#b2fab4', '#393f4d', '#FF4136', '#0074D9' ],



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
        type: 'line',
        zoom: {
          enabled: true
        }
      },
      dataLabels: {
        enabled: true,
        style: {
          colors: ['#519657'],
          fontSize: '12px'
        },
        formatter: function (val) {
          return val.toLocaleString('hu')  + ' Ft';
        }
      },
      markers: {
        colors: ['#519657'],
        size: 5,
        hover: {
          size: 12
        },
      },
      stroke: {
        curve: 'smooth',
        colors: ['#8BC34A']
      },
      series: [{
        name: 'Expenses',
        data: this.lineChartValues
      }],
      title: {
        text: 'Expenses by day',
        align: 'left'
      },
      grid: {
        row: {
          colors: ['#8BC34A' , 'transparent'], // takes an array which will be repeated on columns
          opacity: 0.2
        },
      },
      xaxis: {
        categories: this.lineChartKeys,
      }
    };

    this.lineChart = new ApexCharts(
      document.querySelector('#lineChart'),
      options
    );

    this.lineChart.render();

  }


}
