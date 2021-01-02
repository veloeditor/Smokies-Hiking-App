import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';

import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { UserHike } from 'src/app/interfaces/user-hike';
import { Trail } from '../../interfaces/trail';
import { UserHikesService } from 'src/app/services/user-hikes.service';
import { TrailsService } from 'src/app/services/trails.service';
import { MatSnackBar } from '@angular/material/snack-bar';

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
  pictureLink = '';
  trailObjSelectedMiles = 0;
  sectionNameArray: [{sectionName: string, sectionLength: number}];
  selectedSection = [];
  hikedNames = [];
  hikedSectionNames = [];
  trailObjectedEdited = null;
  roundTripMileage: number;

  constructor(
    private userHikesService: UserHikesService,
    private fb: FormBuilder,
    private trailsService: TrailsService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.trailsService.getAllTrails().subscribe((data: any[]) => {
      this.trails = data;
      const hikedTrailName = this.userHike.trailName;
      this.trailObjectedEdited = this.trails?.find((t) => t.name === hikedTrailName);
      const results = this.trailObjectedEdited.sections.filter(( { sectionName: id1 }) =>
        this.userHike.sections.some(({ sectionName: id2 }) => id2 === id1));
      this.trailForm.get('sections').setValue(results);
    });

    this.trailForm = this.fb.group({
      trailName: [this.defaultString(this.userHike?.trailName), [Validators.required]],
      totalMiles: [this.defaultNumber(this.userHike?.totalMiles), [Validators.required]],
      date: [this.defaultDate(this.userHike?.date), [Validators.required]],
      comments: this.defaultString(this.userHike?.comments),
      sections: this.defaultSections(this.trailObjectedEdited?.sections),
      roundTrip: [this.defaultBoolean(this.userHike?.roundTrip)],
      roundTripMiles: [this.defaultNumber(this.userHike?.roundTripMiles)]
    });

    this.sectionNameArray = this.userHike.sections;

    this.filteredTrails = this.trailForm.controls.trailName.valueChanges
    .pipe(
      startWith(''),
      map(value => this.findOption(value))
    );

      // this makes sure whatever is in the totalMiles input is always sent to database when submitting
    this.trailForm.controls.totalMiles.valueChanges.subscribe((value) => {
        this.trailObjSelectedMiles = value;
        if (!this.userHike.roundTrip) {
          this.roundTripMileage = 0;
        } else {
          this.roundTripMileage = this.trailObjSelectedMiles;
        }
    });

    this.trailForm.get('totalMiles').setValue(this.userHike.totalMiles);


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

    this.trailForm.controls.roundTrip.valueChanges.subscribe((value) => {
      if (value) {
        this.roundTripMileage = this.trailObjSelectedMiles;
      } else {
        this.roundTripMileage = 0;
      }
    });

    this.trailForm.controls.sections.valueChanges.subscribe((value) => {
      this.selectedSection = value;
      if (this.userHike?.sections?.length > 0) {
        const miles = this.selectedSection?.reduce((acc, section) => {
          if (this.hikedSectionNames.includes(section.sectionName)) {
            return 0;
          }
          return acc + Number(section?.sectionLength);
        }, 0);
        this.trailObjSelectedMiles = miles?.toFixed(1);
        if (!this.userHike.roundTrip) {
          this.roundTripMileage = 0;
        } else {
          this.roundTripMileage = this.trailObjSelectedMiles;
        }
      }
    });

    console.log(this.trailForm.value);
  }

  private defaultString(value: string): string {
    return value ? value : '';
  }

  private defaultNumber(value: number): number {
    return value ? value : 0;
  }

  private defaultBoolean(value: boolean): boolean {
    return (value === true) ? true : false;
  }

  private defaultSections(value: []): [] {
    return value ? value : [];
  }

  private defaultDate(value: Date): Date {
    return value ? value : new Date();
  }

  findOption(val: string) {
    const filterValue = val?.toString().toLowerCase();
    return this.trails?.filter(option => option.name.toLowerCase().includes(filterValue));
  }

  saveTrail(trailForm: FormGroup) {
    const hike = {
      id: this.userHike.id,
      trailName: this.trailForm.value.trailName,
      totalMiles: Number(this.trailObjSelectedMiles),
      date: this.trailForm.value.date,
      comments: this.trailForm.value.comments,
      sections: this.trailForm.value.sections,
      roundTrip: this.trailForm.value.roundTrip,
      roundTripMiles: Number(this.roundTripMileage),
      photoUrl: this.userHike.photoUrl
    } as UserHike;

    this.userHikesService.updateHike(hike).subscribe(_ => {
      this.snackBar.open('Successfully updated hike', 'Close', {
        duration: 5000,
      });
      this.saveTrailForm.emit(false);
      });
  }

}
