import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { NgZone, ViewChild } from '@angular/core';
import { take } from 'rxjs/operators';

import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { UserHike } from 'src/app/interfaces/user-hike';
import { Trail } from '../../interfaces/trail';
import { UserHikesService } from 'src/app/services/user-hikes.service';
import { TrailsService } from 'src/app/services/trails.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CdkTextareaAutosize } from '@angular/cdk/text-field';

@Component({
  selector: 'app-hike-form',
  templateUrl: './hike-form.component.html',
  styleUrls: ['./hike-form.component.scss']
})
export class HikeFormComponent implements OnInit {

  @Input() userHike: UserHike;
  @Output() saveTrailForm: EventEmitter<boolean> = new EventEmitter<boolean>();
  @ViewChild('autosize') autosize: CdkTextareaAutosize;

  trails: Trail[];
  hikes: UserHike[];
  trailForm: FormGroup;
  filteredTrails: Observable<Trail[]>;
  pictureLink = '';
  trailObjSelectedMiles = 0;
  sectionNameArray: [{ sectionName: string, sectionLength: number }];
  selectedSection = [];
  alreadyHikedSelection = [];
  hikedNames = [];
  hikedSectionNames = [];
  trailObjSelected: Trail[];
  trailObjectedEdited = null;
  roundTripMileage: number;
  extraMiles: number;
  hashiked: boolean;

  constructor(
    private userHikesService: UserHikesService,
    private fb: FormBuilder,
    private trailsService: TrailsService,
    private snackBar: MatSnackBar,
    private ngZone: NgZone
  ) { }

  ngOnInit(): void {
    this.getUserHikes();

    this.trailsService.getAllTrails().subscribe((data: any[]) => {
      this.trails = data;
      this.rebuildTrailSections();
    });

    this.trailForm = this.fb.group({
      trailName: [this.defaultString(this.userHike?.trailName), [Validators.required]],
      totalMiles: [this.defaultNumber(this.userHike?.totalMiles), [Validators.required]],
      date: [this.defaultDate(this.userHike?.date), [Validators.required]],
      comments: this.defaultString(this.userHike?.comments),
      sections: this.defaultSections(this.trailObjectedEdited?.sections),
      roundTrip: [this.defaultBoolean(this.userHike?.roundTrip)],
      roundTripMiles: [this.defaultNumber(this.userHike?.roundTripMiles)],
      photoUrl: this.defaultString(this.userHike?.photoUrl)
    });

    this.sectionNameArray = this.userHike?.sections;

    this.filteredTrails = this.trailForm.controls.trailName.valueChanges
      .pipe(
        startWith(''),
        map(value => this.findOption(value))
      );

    this.trailForm.controls.roundTrip.valueChanges.subscribe((change) => {
      if (change) {
        this.extraMiles = this.trailObjSelectedMiles;
      }
    });

    // this makes sure whatever is in the totalMiles input is always sent to database when submitting
    this.trailForm.controls.totalMiles.valueChanges.subscribe((value) => {
      this.trailObjSelectedMiles = value;
      if (!this.userHike?.roundTrip) {
        this.roundTripMileage = 0;
      } else {
        this.roundTripMileage = this.trailObjSelectedMiles;
      }
    });

    this.trailForm?.get('totalMiles').setValue(this.userHike?.totalMiles);

    this.trailForm.controls.trailName.valueChanges.subscribe((change) => {
      const trailObjSelected = this.trails?.find((t) => t.name === change);
      if (change === '') {
        this.hashiked = false;
      }
      if (trailObjSelected?.sections?.length < 1) {
        if (this.hikedNames.includes(trailObjSelected.name)) {
          this.hashiked = true;
          this.roundTripMileage = trailObjSelected?.length;
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

    this.trailForm.controls.trailName.valueChanges.subscribe((change) => {
      const trailObjSelected = this.trails?.find((t) => t.name === change);
      if (trailObjSelected?.photoUrl !== '') {
        this.pictureLink = trailObjSelected?.photoUrl;
      } else {
        this.pictureLink = '';
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
      this.hashiked = false;
      this.selectedSection = value;
      if (this.selectedSection?.length !== 0 || !this.userHike?.id) {
        // change the following to either set miles equal to 'miles' or 'extraMiles' based on whether
        const miles = this.selectedSection?.reduce((acc, section) => {
          this.hashiked = false;
          if (!this.userHike?.id && this.hikedSectionNames.includes(section.sectionName)) {
            this.hashiked = true;
            return 0;
          } else {
            return acc + Number(section?.sectionLength);
          }
        }, 0);
        this.trailObjSelectedMiles = miles?.toFixed(1);
        if (this.trailForm.controls.roundTrip.value === true) {
          this.extraMiles = this.trailObjSelectedMiles;
          this.roundTripMileage = this.extraMiles;
        }
      }
    });

    // this is to account for sections already hiked so the miles are counted towards total
    // this.trailForm.controls.sections.valueChanges.subscribe((response) => {
    //   this.hashiked = false;
    //   this.alreadyHikedSelection = response;
    //   if (this.selectedSection?.length !== 0 || !this.userHike?.id) {
    //     let miles = null;
    //     miles = this.alreadyHikedSelection?.reduce((acc, section) => {
    //       if (!this.userHike?.id && this.hikedSectionNames.includes(section.sectionName)) {
    //         this.hashiked = true;
    //         return acc + Number(section?.sectionLength);
    //       }
    //     }, 0);
    //     this.roundTripMileage = miles?.toFixed(1);
    //   }
    // });
  }

  private getUserHikes() {
    this.userHikesService.getAllUserHikes().subscribe((data: any[]) => {
      this.hikes = data;
      this.hiked();
    });
  }

  // when edited trail with sections, the following grabs all the trail's sections, not just those part of edited obj
  private rebuildTrailSections() {
    const hikedTrailName = this.userHike?.trailName;
    this.trailObjectedEdited = this.trails?.find((t) => t.name === hikedTrailName);
    const results = this.trailObjectedEdited?.sections.filter(({ sectionName: id1 }) => this.userHike.sections
      .some(({ sectionName: id2 }) => id2 === id1));
    this.trailForm.get('sections').setValue(results);
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

  triggerResize() {
    // Wait for changes to be applied, then trigger textarea resize.
    this.ngZone.onStable.pipe(take(1))
        .subscribe(() => this.autosize.resizeToFitContent(true));
  }

  saveTrail(trailForm: FormGroup) {
    const hike = {
      id: this.userHike?.id,
      trailName: this.trailForm.value.trailName,
      totalMiles: Number(this.trailObjSelectedMiles),
      date: this.trailForm.value.date,
      comments: this.trailForm.value.comments,
      sections: this.trailForm.value.sections,
      roundTrip: this.trailForm.value.roundTrip,
      roundTripMiles: Number(this.roundTripMileage),
      photoUrl: this.pictureLink
    } as UserHike;

    if (this.userHike?.id) {
      this.userHikesService.updateHike(hike).subscribe(_ => {
        this.saveTrailForm.emit(false);
      });
    } else {
      this.userHikesService.postHike(hike).subscribe(_ => {
      });
      this.saveTrailForm.emit(false);
    }
  }

  hiked() {
    this.hikes?.forEach((hike) => {
      if (hike?.sections === null || hike.sections?.length < 1) {
        const trailName = hike.trailName;
        this.hikedNames.push(trailName);
        console.log(this.hikedNames);
      } else {
        hike?.sections?.forEach((section) => {
          const sectionName = section.sectionName;
          this.hikedSectionNames.push(sectionName);

        });
      }
    });
  }

}
