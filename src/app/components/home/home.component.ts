import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs';
import { TrailsService } from '../../services/trails.service';
import { Trail } from '../../interfaces/trail';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {

  trails: Trail[];
  destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(private trailsService: TrailsService) {
  }

  ngOnInit() {
    this.trailsService.getAllTrails().pipe(takeUntil(this.destroy$)).subscribe((data: any[]) => {
      this.trails = data;
      console.log(this.trails);
    });
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

}
