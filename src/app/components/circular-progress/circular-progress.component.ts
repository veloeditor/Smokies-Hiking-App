import { Component, OnInit, ViewChild } from '@angular/core';
import { CircleProgressComponent, CircleProgressOptions } from 'ng-circle-progress';
import { User } from 'src/app/interfaces/user';
import { UserHike } from 'src/app/interfaces/user-hike';
import { UserHikesService } from 'src/app/services/user-hikes.service';
import { UserService } from 'src/app/services/user.service';


@Component({
  selector: 'app-circular-progress',
  templateUrl: './circular-progress.component.html',
  styleUrls: ['./circular-progress.component.scss']
})
export class CircularProgressComponent implements OnInit {

  @ViewChild('circleProgress') circleProgress: CircleProgressComponent;

  ngCircleOptions = {};
  users: User[];
  userHikes: UserHike[];
  goal: number;
  uniqueMiles: number;
  currentProgress: number;

  constructor(private userService: UserService,
              private userHikesService: UserHikesService) { }

  ngOnInit(): void {
    this.userService.getAllUsers().subscribe((user: any[]) => {
      this.users = user;
      this.goal = this.users[0].goal;
      console.log(this.goal);
      this.userHikesService.getAllUserHikes().subscribe((data: UserHike[]) => {
        this.userHikes = data;
        const miles = this.userHikes.reduce((acc, userHike) => {
          return acc + Number(userHike.totalMiles);
        }, 0);
        this.uniqueMiles = Number(miles.toFixed(1));
        this.percentageGoal();
        this.triggerCircularProgress();
      });
    });

  }

  private percentageGoal() {
    const percentage = (this.uniqueMiles / this.goal) * 100;
    this.currentProgress = Number(percentage.toFixed(1));
    console.log('this.uniqueMiles', this.uniqueMiles);
    console.log('this.goal', this.goal);
    console.log('percentageGoal() fired');
    console.log('currentProgress', this.currentProgress);
  }

  private triggerCircularProgress() {
    console.log(this.currentProgress);
    this.ngCircleOptions = {
      percent: this.currentProgress,
      space: -10,
      radius: 132,
      outerStrokeWidth: 10,
      innerStrokeWidth: 9,
      outerStrokeColor: '#1b5e20',
      innerStrokeColor: 'white',
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

}
