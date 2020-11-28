import { Component, OnDestroy, OnInit } from '@angular/core';
import { getMatIconFailedToSanitizeUrlError } from '@angular/material/icon';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Trail } from 'src/app/interfaces/trail';
import { UserHike } from 'src/app/interfaces/user-hike';
import { TrailsService } from 'src/app/services/trails.service';
import { UserHikesService } from 'src/app/services/user-hikes.service';

@Component({
  selector: 'app-trails-list',
  templateUrl: './trails-list.component.html',
  styleUrls: ['./trails-list.component.scss'],
})
export class TrailsListComponent implements OnInit, OnDestroy {
  trails: Trail[];
  hikes: UserHike[];
  destroy$: Subject<boolean> = new Subject<boolean>();
  hasHiked = false;
  hikedNames = [];
  hikedSectionNames = [];
  hikedAllSections: false;

  constructor(
    private trailsService: TrailsService,
    private userHikesService: UserHikesService
  ) {}

  ngOnInit() {
    this.trailsService
      .getAllTrails()
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: any[]) => {
        this.trails = data;
      });
    this.userHikesService.getAllUserHikes().subscribe((data: any[]) => {
      this.hikes = data;
      this.hiked();
    });
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  // this populates two arrays, one tha contains names of simple trails, the other sectionnames
  hiked() {
    this.hikes?.forEach((hike) => {
      if (hike.sections === null) {
        const trailName = hike.trailName;
        this.hikedNames.push(trailName);
      } else {
        hike.sections.forEach((section) => {
          const sectionName = section.sectionName;
          this.hikedSectionNames.push(sectionName);
        });
      }
    });
  }

  // take the hike.sections array and compare it to the same trail.sections array.
  // Are lengths equal? If not then that trail is not fully completed.
  compareTrailsWithSections(trail: Trail) {
    const matchedHike = this.hikes?.find((h) => h.trailName === trail.name);
    if (matchedHike?.sections?.length === trail?.sections?.length) {
      return true;
    }
  }
}
