import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
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
      console.log('ngOnInit fires');
    });

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
      }
    });

    this.trailForm.controls.comments.valueChanges.subscribe((comment) => {
      console.log('comments', comment);
    });

    this.trailForm.controls.sections.valueChanges.subscribe((value) => {
      let selectedSection = [];
      selectedSection = value;
      const miles = selectedSection.reduce((acc, section) => {
        return acc + Number(section.sectionLength);
      }, 0);
      this.trailObjSelectedMiles = miles.toFixed(1);
      // this.trailObjSelectedMiles += value[0]?.sectionLength;
      // this.trailObjSelectedMiles.toFixed(1);
      console.log(miles);
    });
  }

  get sections(): FormControl {
    return this.trailForm.get('sections') as FormControl;
  }

  saveTrail(trailForm: FormGroup): void {
    const hike = {
      trailName: this.trailForm.value.trailName,
      totalMiles: this.trailObjSelectedMiles,
      date: this.trailForm.value.date,
      comments: this.trailForm.value.comments,
      sections: this.trailForm.value.sections
    } as UserHike;

    this.userHikesService.postHike(hike).subscribe(_ => {
    });
    this.getUserHikes();

  }

  private getUserHikes() {
    this.userHikesService.getAllUserHikes().subscribe((data: any[]) => {
      this.userHikes = data;
      this.userHikes.sort((a, b) => new Date(a?.date) > new Date(b?.date) ? -1 : 1
      );
      const miles = this.userHikes.reduce((acc, userHike) => {
        return acc + Number(userHike.totalMiles);
      }, 0);
      this.userUniqueMilesHiked = miles.toFixed(1);
      console.log('ngOnInit fires');
    });
  }

  openForm() {
    this.addUser = !this.addUser;
  }
}
