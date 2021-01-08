import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { UserHike } from '../interfaces/user-hike';
import { TrailsService } from './trails.service';
import { UserHikesService } from './user-hikes.service';

@Injectable({
  providedIn: 'root'
})
export class MileageService {

  userHikes: UserHike[];
  mileage = null;
  uniqueMiles = null;
  totalMiles = null;
  uniqueMileObserverable$ = new Subject<number>();

  constructor(
    private trailsService: TrailsService,
    private userHikesService: UserHikesService
  ) { }

  userUniqueHikes(): Observable<number> {
    this.userHikesService.getAllUserHikes().subscribe((data: UserHike[]) => {
      this.userHikes = data;
      const miles = this.userHikes?.reduce((acc, userHike) => {
          return acc + Number(userHike.totalMiles);
        }, 0);
      this.mileage = Number(miles?.toFixed(1));
      this.uniqueMileObserverable$.next(this.mileage);
      this.uniqueMileObserverable$.complete();
      return this.uniqueMileObserverable$.asObservable();
    });
    return this.uniqueMileObserverable$.asObservable();
  }

}
