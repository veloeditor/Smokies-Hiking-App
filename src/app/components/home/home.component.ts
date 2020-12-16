import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs';
import { TrailsService } from '../../services/trails.service';
import { UserHikesService } from '../../services/user-hikes.service';
import { Trail } from '../../interfaces/trail';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { UserHike } from 'src/app/interfaces/user-hike';
import { Chart } from 'chart.js';
import { DatePipe } from '@angular/common';
import { CircleProgressComponent, CircleProgressOptions } from 'ng-circle-progress';
import { ViewChild } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  providers: [DatePipe]
})
export class HomeComponent implements OnInit, OnDestroy {

  constructor(private trailsService: TrailsService, private userHikesService: UserHikesService, private datePipe: DatePipe) {
  }

  @ViewChild('circleProgress') circleProgress: CircleProgressComponent;

  trails: Trail[];
  userHikes: UserHike[];
  destroy$: Subject<boolean> = new Subject<boolean>();
  uniqueMiles = null;
  currentProgress = null;
  mostRecentHike = null;
  lineChart = [];
  ngCircleOptions = {};
  goal = 800;

  ngOnInit() {
    this.trailsService.getAllTrails().pipe(takeUntil(this.destroy$)).subscribe((data: any[]) => {
      this.trails = data;
    });

    this.userHikesService.getAllUserHikes().subscribe((data: UserHike[]) => {
      this.userHikes = data;
      const miles =  this.userHikes.reduce((acc, userHike) => {
        return acc + Number(userHike.totalMiles);
       }, 0);
      this.uniqueMiles = miles.toFixed(1);
      const percentage = (this.uniqueMiles / 800) * 100;
      this.currentProgress = percentage.toFixed(1);
      const milesArray = [];
      const reduceMilesArray = [];
      const hikeDatesArray = [];

      this.userHikes.forEach(hike => {
        const hikeMiles = hike.totalMiles;
        milesArray.push(hikeMiles);
        milesArray.reduce((prev, curr, i) => reduceMilesArray[i] = prev + curr, 0);
        const hikeDate = hike.date;
        const convertedDate = new DatePipe('en-US').transform(hikeDate, 'MM-dd-yyyy');
        hikeDatesArray.push(convertedDate);
        hikeDatesArray.sort();

      });

      this.ngCircleOptions = {
        percent: this.currentProgress,
        radius: 132,
        outerStrokeWidth: 9,
        innerStrokeWidth: 8,
        outerStrokeColor: '#cfc460',
        innerStrokeColor: '#1b5e20',
        animation: true,
        animationDuration: 300,
        subtitleFormat: (percent: number): string => {
          if (percent >= 100){
            return 'Congratulations!';
          } else if (percent >= 50) {
            return 'Halfway!';
          } else if (percent > 0) {
            return 'Just getting started';
          } else {
            return 'No hikes as of yet';
          }
      }
    };

      this.lineChart = new Chart('lineChart', {
        type: 'line',
        data: {
          labels: hikeDatesArray,
          datasets: [
            {
              data: reduceMilesArray,
              borderColor: '#cfc460',
              fill: true
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

      this.userHikes.forEach(hike => {
        const dateArray = [];
        const date = hike.date;
        dateArray.push(date);
        dateArray.reduce((a, b) => b > a ? b : a);
        this.mostRecentHike = dateArray[dateArray.length - 1];
      });
    });
  }

ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

}
