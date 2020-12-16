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
  goal = null;
  isUpdatingGoal = false;

  constructor(private trailsService: TrailsService,
              private userHikesService: UserHikesService,
              private datePipe: DatePipe,
              private userService: UserService,
              private fb: FormBuilder,
              private snackBar: MatSnackBar
              ) {
}

  ngOnInit() {
    this.trailsService.getAllTrails().pipe(takeUntil(this.destroy$)).subscribe((data: any[]) => {
      this.trails = data;
    });

    this.userService.getAllUsers().pipe(takeUntil(this.destroy$)).subscribe((data: any[]) => {
      this.users = data;
      this.goal = this.users[0].goal;
      this.user = this.users[0];
      console.log(this.user);
    });

    this.userHikesService.getAllUserHikes().subscribe((data: UserHike[]) => {
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
        goal: [this.goal, [Validators.required]]
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
          if (percent >= 100) {
            return 'Congratulations!';
          } else if (percent >= 50) {
            return 'Halfway there!';
          } else if (percent > 0) {
            return 'Just getting going!';
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

  private percentageGoal() {
    const percentage = (this.uniqueMiles / this.goal) * 100;
    this.currentProgress = percentage.toFixed(1);
  }

  editUserGoal() {
    console.log('I was clicked');
    this.isUpdatingGoal = !this.isUpdatingGoal;
  }

  updateGoal(goalForm: FormGroup) {
    const user = {
      id: this.user.id,
      goal: this.goalForm.value.goal
    } as User;

    this.userService.editUser(user).subscribe(_ => {
      this.isUpdatingGoal = false;
      this.ngOnInit();
      // this.percentageGoal();
      this.snackBar.open('You have udpated your goal!', 'Close', {
        duration: 5000,
      });
    });
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

}
