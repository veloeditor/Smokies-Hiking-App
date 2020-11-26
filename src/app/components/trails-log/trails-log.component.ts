import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { Trail } from '../../interfaces/trail';

import { UserHike } from '../../interfaces/user-hike';
import { UserHikesService } from '../../services/user-hikes.service';
import { TrailsService } from '../../services/trails.service';

@Component({
  selector: 'app-trails-log',
  templateUrl: './trails-log.component.html',
  styleUrls: ['./trails-log.component.scss'],
})
export class TrailsLogComponent implements OnInit {
  trailForm: FormGroup;

  userHikes: UserHike[];
  addUser = false;

  trails: Trail[];

  trailSelected: Trail;
  trailObjSelectedMiles = 0;
  sectionNameArray: [{sectionName: string, sectionLength: number}];

  userUniqueMilesHiked = null;

  constructor(
    private userHikesService: UserHikesService,
    private fb: FormBuilder,
    private trailsService: TrailsService
  ) {}

  ngOnInit(): void {
    this.userHikesService.getAllUserHikes().subscribe((data: any[]) => {
      this.userHikes = data;
      this.userHikes.sort((a, b) =>
        new Date(a?.date) > new Date(b?.date) ? -1 : 1
      );
      const miles = this.userHikes.reduce((acc, userHike) => {
        return acc + Number(userHike.totalMiles);
      }, 0);
      this.userUniqueMilesHiked = miles.toFixed(1);
    });

    // ToDo: put call to trailsService to retrieve all trails and set equal to trails for auto-complete
    this.trailsService.getAllTrails().subscribe((data: any[]) => {
      this.trails = data;
      console.log(this.trails);
    });

    this.trailForm = this.fb.group({
      trailName: '',
      totalMiles: this.trailObjSelectedMiles,
      date: new Date(),
      comments: '',
      sections: this.sectionNameArray,
    });

    // ToDo: probably need to move logic for determining length of hike out of here and
    // move to line 82 where we are looking at the valueChange of the sections form field

    this.trailForm.controls.trailName.valueChanges.subscribe((change) => {
      const trailObjSelected = this.trails?.find((t) => t.name === change);
      if (trailObjSelected?.sections?.length < 1) {
        if (trailObjSelected?.length !== undefined) {
          this.trailObjSelectedMiles = trailObjSelected?.length;
        } else {
          this.trailObjSelectedMiles = 0;
        }
      } else {
        this.sectionNameArray = trailObjSelected?.sections;
        this.trailObjSelectedMiles = 0;
        this.sectionNameArray.forEach((section) => {
          this.trailObjSelectedMiles += section.sectionLength;
        });
      }
    });

    this.trailForm.controls.comments.valueChanges.subscribe((comment) => {
      console.log('comments', comment);
    });

    this.trailForm.controls.sections.valueChanges.subscribe((value) => {
      console.log('sections', value[0].sectionLength);
    });
  }

  saveTrail(trailForm: FormGroup): void {
    const hike = {
      trailName: this.trailForm.value.trailName,
      totalMiles: this.trailForm.value.totalMiles,
      date: this.trailForm.value.date,
      comments: this.trailForm.value.comments,
      sections: this.trailForm.value.sections
    } as UserHike;

    this.userHikesService.postHike(hike).subscribe(data => {
      console.log(data);
    });

    this.userHikesService.getAllUserHikes();
  }

  openForm() {
    this.addUser = true;
  }
}
