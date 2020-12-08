import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';

import { Component, Input, OnInit } from '@angular/core';
import { UserHike } from 'src/app/interfaces/user-hike';
import { Trail } from '../../interfaces/trail';
import { UserHikesService } from 'src/app/services/user-hikes.service';
import { TrailsService } from 'src/app/services/trails.service';


@Component({
  selector: 'app-hike-form',
  templateUrl: './hike-form.component.html',
  styleUrls: ['./hike-form.component.scss']
})
export class HikeFormComponent implements OnInit {

  @Input() userHike: UserHike;

  trailForm: FormGroup;
  filteredTrails: Observable<Trail[]>;
  trailObjSelectedMiles = 0;
  sectionNameArray: [{sectionName: string, sectionLength: number}];
  selectedSection = [];



  constructor(
    private userHikesService: UserHikesService,
    private fb: FormBuilder,
    private trailsService: TrailsService
  ) { }

  ngOnInit(): void {
  }

}
