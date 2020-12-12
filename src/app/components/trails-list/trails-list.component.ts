import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatExpansionPanel } from '@angular/material/expansion';
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
  @ViewChild('matExpansionPanel', { static: true }) matExpansionPanelElement: MatExpansionPanel;

  trails: Trail[];
  hikes: UserHike[];
  destroy$: Subject<boolean> = new Subject<boolean>();
  hasHiked = false;
  hikedNames = [];
  hikedSectionNames = [];
  hikedAllSections: false;
  dataSource: Trail[];

  trailListSearchForm: FormGroup;

  constructor(
    private trailsService: TrailsService,
    private userHikesService: UserHikesService,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.trailsService
      .getAllTrails()
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: any[]) => {
        this.trails = data;
        this.dataSource = this.trails;
      });
    this.userHikesService.getAllUserHikes().subscribe((data: any[]) => {
      this.hikes = data;
      this.hiked();
    });

    this.trailListSearchForm = this.fb.group({
      search: ''
    });
    this.trailListSearchForm.valueChanges.subscribe((change: { search: string }) => {
      this.searchList(change.search);
    });
  }

  private searchList(filter: string): void {
    this.dataSource = this.filterSources(this.trails, filter);
  }

  filterSources(trails: Trail[], filter: string): Trail[] {
    const filteredSourceConfigs = trails?.filter((trail: Trail) => {
      const searchText = `${trail.name}`;
      return searchText?.toLowerCase().indexOf(filter?.toLowerCase().trim()) !== -1;
    });
    return filteredSourceConfigs;
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
  isTrailFullyHiked(trail: Trail) {
    const matchedHike = this.hikes?.find((h) => h.trailName === trail.name);
    if (matchedHike?.sections?.length === trail?.sections?.length) {
      return true;
    }
  }

  trailWithSectionsProgress(trail: Trail) {
    const matchedHike = this.hikes?.find((h) => h.trailName === trail.name);
    if (matchedHike?.sections?.length > 0 && matchedHike?.sections?.length !== trail?.sections?.length) {
      return true;
    }
  }
}
