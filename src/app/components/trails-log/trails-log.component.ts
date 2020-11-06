import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { UserHike } from 'src/app/interfaces/user-hike';
import { UserHikesService } from 'src/app/services/user-hikes.service';

@Component({
  selector: 'app-trails-log',
  templateUrl: './trails-log.component.html',
  styleUrls: ['./trails-log.component.scss'],
})
export class TrailsLogComponent implements OnInit {
  trailForm: FormGroup;


  userHikes: UserHike[];
  addUser = false;

  constructor(
    private userHikesService: UserHikesService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.userHikesService.getAllUserHikes().subscribe((data: any[]) => {
      this.userHikes = data;
    });

    this.trailForm = this.fb.group({
      trailName: '',
      totalMiles: null,
      date: new Date(),
      comments: '',
      sections: [{
        sectionName: 'Section Name',
        sectionLength: 9
      }]
    });
  }

  saveTrail(trailForm: FormGroup): void {
    const hike = {
      trailName: this.trailForm.value.trailName,
      totalMiles: this.trailForm.value.totalMiles,
      date: this.trailForm.value.date,
      comments: this.trailForm.value.comments,
      sections: [{
        sectionName: 'Section Name',
        sectionLength: 9
      }]
    } as UserHike;

    console.log(trailForm.value);
    this.userHikesService.postHike(hike);
  }

  openForm() {
    this.addUser = true;
    console.log('open form');
  }
}
