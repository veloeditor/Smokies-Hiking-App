import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';

import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
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
  @Output() saveTrailForm: EventEmitter<boolean> = new EventEmitter<boolean>();

  trails: Trail[];
  trailForm: FormGroup;
  filteredTrails: Observable<Trail[]>;
  trailObjSelectedMiles = 0;
  sectionNameArray: [{sectionName: string, sectionLength: number}];
  selectedSection = [];
  hikedNames = [];
  hikedSectionNames = [];
  trailSelected: Trail;
  userUniqueMilesHiked = null;
  trailObjectedEdited = null;

  constructor(
    private userHikesService: UserHikesService,
    private fb: FormBuilder,
    private trailsService: TrailsService
  ) { }

  ngOnInit(): void {
    this.trailsService.getAllTrails().subscribe((data: any[]) => {
      this.trails = data;
      const hikedTrailName = this.userHike.trailName;
      this.trailObjectedEdited = this.trails?.find((t) => t.name === hikedTrailName);
      console.log(this.trailObjectedEdited);
    });

    this.trailForm = this.fb.group({
      trailName: [this.defaultString(this.userHike?.trailName), [Validators.required]],
      totalMiles: [this.defaultNumber(this.userHike.totalMiles), [Validators.required]],
      date: [this.userHike?.date, [Validators.required]],
      comments: this.userHike?.comments,
      sections: this.sectionNameArray,
    });

    this.sectionNameArray = this.userHike.sections;

    this.trailForm.get('sections').setValue(this.sectionNameArray);

    this.filteredTrails = this.trailForm.controls.trailName.valueChanges
    .pipe(
      startWith(''),
      map(value => this.findOption(value))
    );

    this.trailForm.controls.trailName.valueChanges.subscribe((change) => {
      const trailObjSelected = this.trails?.find((t) => t.name === change);
      if (trailObjSelected?.sections?.length < 1) {
        if (this.hikedNames.includes(trailObjSelected.name)) {
          window.alert('You already hiked this!');
        }
        if (trailObjSelected?.length !== undefined && !this.hikedNames.includes(trailObjSelected.name)) {
          this.trailObjSelectedMiles = trailObjSelected?.length;
        } else {
          this.trailObjSelectedMiles = 0;
        }
      } else {
        this.trailObjSelectedMiles = 0;
        this.sectionNameArray = trailObjSelected?.sections;
      }
    });

    this.trailForm.controls.sections.valueChanges.subscribe((value) => {
      this.selectedSection = value;
      const miles = this.selectedSection?.reduce((acc, section) => {
        if (this.hikedSectionNames.includes(section.sectionName)) {
          console.log(section.sectionName);
          return 0;
        }
        return acc + Number(section?.sectionLength);
      }, 0);
      this.trailObjSelectedMiles = miles?.toFixed(1);
    });
  }

  private defaultString(value: string): string {
    return value ? value : '';
  }

  private defaultNumber(value: number): number {
    return value ? value : 0;
  }

  findOption(val: string) {
    const filterValue = val?.toString().toLowerCase();
    return this.trails?.filter(option => option.name.toLowerCase().includes(filterValue));
  }

  saveTrail(trailForm: FormGroup) {
    const hike = {
      id: this.userHike.id,
      trailName: this.trailForm.value.trailName,
      totalMiles: this.trailObjSelectedMiles,
      date: this.trailForm.value.date,
      comments: this.trailForm.value.comments,
      sections: this.trailForm.value.sections
    } as UserHike;

    this.userHikesService.updateHike(hike).subscribe(_ => {
      this.saveTrailForm.emit(false);
      });
  }

}
