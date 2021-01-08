import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Chart } from 'chart.js';
import { UserHike } from 'src/app/interfaces/user-hike';
import { UserHikesService } from 'src/app/services/user-hikes.service';

@Component({
  selector: 'app-mileage-chart',
  templateUrl: './mileage-chart.component.html',
  styleUrls: ['./mileage-chart.component.scss']
})
export class MileageChartComponent implements OnInit {

  userHikes: UserHike[];
  lineChart = [];

  constructor(private userHikesService: UserHikesService) { }

  ngOnInit(): void {
    this.getAllUserHikes();
  }

  private getAllUserHikes() {
    this.userHikesService.getAllUserHikes().subscribe((data: UserHike[]) => {
      this.userHikes = data;
      const milesArray = [];
      const reduceMilesArray = [];
      const hikeDatesArray = [];
      this.dataForChart(milesArray, reduceMilesArray, hikeDatesArray);
      this.createBarChart(hikeDatesArray, reduceMilesArray);
    });
  }

  private dataForChart(milesArray: any[], reduceMilesArray: any[], hikeDatesArray: any[]) {
      this.userHikes?.forEach(hike => {
      const hikeMiles = hike.totalMiles;
      milesArray.push(hikeMiles);
      milesArray.reduce((prev, curr, i) => reduceMilesArray[i] = prev + curr, 0);
      const hikeDate = hike.date;
      const convertedDate = new DatePipe('en-US').transform(hikeDate, 'MM-dd-yyyy');
      hikeDatesArray.push(convertedDate);
      hikeDatesArray.sort();
    });
  }

  private createBarChart(hikeDatesArray: any[], reduceMilesArray: any[]) {
    this.lineChart = new Chart('lineChart', {
      type: 'line',
      data: {
        labels: hikeDatesArray,
        datasets: [
          {
            data: reduceMilesArray,
            borderColor: '#cfc460',
            fill: true,
            pointStyle: 'rectRounded',
            backgroundColor: 'rgba(0, 0, 0, 0.3)'
          }
        ]
      },
      options: {
        legend: {
          display: false
        },
        sampleSize: 3,
        scales: {
          xAxes: [{
            display: true,
            type: 'time',
            time: {
              unit: 'month'
            }
          }],
          yAxes: [{
            display: true
          }],
        }
      }
    });
  }

}
