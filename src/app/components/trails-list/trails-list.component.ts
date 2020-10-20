import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Trail } from 'src/app/interfaces/trail';
import { TrailsService } from 'src/app/services/trails.service';

@Component({
  selector: 'app-trails-list',
  templateUrl: './trails-list.component.html',
  styleUrls: ['./trails-list.component.scss']
})
export class TrailsListComponent implements OnInit, OnDestroy {

  trails: Trail[];
  destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(private trailsService: TrailsService) {
  }

  ngOnInit() {
    this.trailsService.getAllTrails().pipe(takeUntil(this.destroy$)).subscribe((data: any[]) => {
      this.trails = data;
    });
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

}
