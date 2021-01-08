import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { TrailsService } from '../../services/trails.service';
import { UserHikesService } from '../../services/user-hikes.service';
import { Trail } from '../../interfaces/trail';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { UserHike } from 'src/app/interfaces/user-hike';
import { DatePipe } from '@angular/common';
import { CircleProgressComponent, CircleProgressOptions } from 'ng-circle-progress';
import { ViewChild } from '@angular/core';
import { User } from 'src/app/interfaces/user';
import { UserService } from 'src/app/services/user.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { MileageService } from 'src/app/services/mileage.service';

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
              private mileageService: MileageService,
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

    this.userHikesService.getAllUserHikes().subscribe((data: UserHike[]) => {
      this.userHikes = data;
      const miles = this.userHikes.reduce((acc, userHike) => {
        return acc + Number(userHike.totalMiles);
      }, 0);
      this.uniqueMiles = miles.toFixed(1);

      this.goalForm = this.fb.group({
        goal: [this.goal, [Validators.required, Validators.max(800.7)]]
      });

      this.getMostRecentHikeDate();
    });

  }

  private getMostRecentHikeDate() {
    this.userHikes.forEach(hike => {
      const dateArray = [];
      const date = hike.date;
      dateArray.push(date);
      dateArray.reduce((a, b) => b > a ? b : a);
      this.mostRecentHike = dateArray[dateArray.length - 1];
    });
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
