import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
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
import { User } from 'src/app/interfaces/user';
import { UserService } from 'src/app/services/user.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  providers: [DatePipe]
})
export class HomeComponent implements OnInit, OnDestroy {

  @ViewChild('circleProgress') circleProgress: CircleProgressComponent;

  trails: Trail[];
  userHikes: UserHike[];
  users: User[];
  user: User;
  goalForm: FormGroup;
  destroy$: Subject<boolean> = new Subject<boolean>();
  uniqueMiles = null;
  currentProgress = null;
  mostRecentHike = null;
  lineChart = [];
  ngCircleOptions = {};
  goal: number;
  isUpdatingGoal = false;

  constructor(private trailsService: TrailsService,
              private userHikesService: UserHikesService,
              private datePipe: DatePipe,
              private userService: UserService,
              private fb: FormBuilder,
              private snackBar: MatSnackBar,
              private router: Router
              ) {}

  ngOnInit() {
    this.trailsService.getAllTrails().pipe(takeUntil(this.destroy$)).subscribe((data: any[]) => {
      this.trails = data;
    });

    this.userService.getAllUsers().pipe(takeUntil(this.destroy$)).subscribe((data: any[]) => {
      this.users = data;
      this.goal = this.users[0].goal;
      this.user = this.users[0];
    });

    this.userHikesService.getAllUserHikes().pipe(takeUntil(this.destroy$)).subscribe((data: UserHike[]) => {
      this.userHikes = data;
      const miles = this.userHikes.reduce((acc, userHike) => {
        return acc + Number(userHike.totalMiles);
      }, 0);
      this.uniqueMiles = miles.toFixed(1);
      this.percentageGoal();
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

      this.goalForm = this.fb.group({
        goal: [this.goal, [Validators.required, Validators.max(800.7)]]
      });
      this.percentageGoal();
      this.triggerCircularProgress();

      this.createBarChart(hikeDatesArray, reduceMilesArray);

      this.userHikes.forEach(hike => {
        const dateArray = [];
        const date = hike.date;
        dateArray.push(date);
        dateArray.reduce((a, b) => b > a ? b : a);
        this.mostRecentHike = dateArray[dateArray.length - 1];
      });
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

  private percentageGoal() {
    const percentage = (this.uniqueMiles / this.goal) * 100;
    this.currentProgress = percentage.toFixed(1);
  }

  private triggerCircularProgress() {
    this.ngCircleOptions = {
      percent: this.currentProgress,
      space: -10,
      radius: 132,
      outerStrokeWidth: 10,
      innerStrokeWidth: 9,
      outerStrokeColor: 'green',
      innerStrokeColor: '#cfc460',
      animation: true,
      animationDuration: 300,
      subtitleFormat: (percent: number): string => {
        if (percent >= 100) {
          return 'Congratulations!';
        } else if (percent >= 50) {
          return 'Halfway there!';
        } else if (percent > 0) {
          return 'Making progress!';
        } else {
          return 'No hikes as of yet';
        }
      }
    };
  }


  editUserGoal() {
    this.isUpdatingGoal = !this.isUpdatingGoal;
  }

  reloadCurrentRoute() {
    const currentUrl = this.router.url;
    this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
        this.router.navigate([currentUrl]);
    });
}

  updateGoal(goalForm: FormGroup) {
    const user = {
      id: this.user.id,
      goal: Number(this.goalForm.value.goal)
    } as User;

    this.userService.editUser(user).subscribe(_ => {
      this.isUpdatingGoal = false;
      this.triggerCircularProgress();
      // this.ngOnInit();
      this.reloadCurrentRoute();
      this.snackBar.open('You have updated your goal!', 'Close', {
        duration: 5000,
      });
    });
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

}
