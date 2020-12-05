import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs';
import { TrailsService } from '../../services/trails.service';
import { UserHikesService } from '../../services/user-hikes.service';
import { Trail } from '../../interfaces/trail';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { UserHike } from 'src/app/interfaces/user-hike';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {

  trails: Trail[];
  userHikes: UserHike[];
  destroy$: Subject<boolean> = new Subject<boolean>();
  goalMiles = null;
  currentProgress = null;
  mostRecentHike = null;

  constructor(private trailsService: TrailsService, private userHikesService: UserHikesService) {
  }

  ngOnInit() {
    this.trailsService.getAllTrails().pipe(takeUntil(this.destroy$)).subscribe((data: any[]) => {
      this.trails = data;
    });

    this.userHikesService.getAllUserHikes().subscribe((data: UserHike[]) => {
      this.userHikes = data;
      const miles =  this.userHikes.reduce((acc, userHike) => {
        return acc + Number(userHike.totalMiles);
       }, 0);
      this.goalMiles = miles.toFixed(1);
      const percentage = (this.goalMiles / 800) * 100;
      this.currentProgress = percentage.toFixed(1);

      this.userHikes.forEach(hike => {
        const dateArray = [];
        const date = hike.date;
        dateArray.push(date);
        dateArray.reduce((a, b) => {return b > a ? b : a;});
        this.mostRecentHike = dateArray[dateArray.length - 1];
        console.log('most recent', this.mostRecentHike);
      });
    });
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

}
