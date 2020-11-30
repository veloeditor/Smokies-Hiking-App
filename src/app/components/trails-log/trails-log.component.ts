import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { startWith, map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Trail } from '../../interfaces/trail';

import { UserHike } from '../../interfaces/user-hike';
import { UserHikesService } from '../../services/user-hikes.service';
import { TrailsService } from '../../services/trails.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent, ConfirmDialogModel } from '../confirm-dialog/confirm-dialog.component';

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
  selectedSection = [];

  filteredTrails: Observable<Trail[]>;

  constructor(
    private userHikesService: UserHikesService,
    private fb: FormBuilder,
    private trailsService: TrailsService,
    public dialog: MatDialog
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

    this.trailsService.getAllTrails().subscribe((data: any[]) => {
      this.trails = data;
    });

    this.trailForm = this.fb.group({
      trailName: ['', [Validators.required]],
      totalMiles: [this.trailObjSelectedMiles, [Validators.required]],
      date: [new Date(), [Validators.required]],
      comments: '',
      sections: this.sectionNameArray,
    });

    this.filteredTrails = this.trailForm.controls.trailName.valueChanges
    .pipe(
      startWith(''),
      map(value => this.findOption(value))
    );

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
      this.selectedSection = value;
      const miles = this.selectedSection.reduce((acc, section) => {
        return acc + Number(section.sectionLength);
      }, 0);
      this.trailObjSelectedMiles = miles.toFixed(1);
    });
  }

  findOption(val: string) {
    const filterValue = val.toString().toLowerCase();
    return this.trails.filter(option => option.name.toLowerCase().includes(filterValue));
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
    this.addUser = false;
  }

  deleteHike(userHike) {
    const hikeId = userHike.id;
    const message = `Are you sure you want to do delete the ${userHike.trailName} hike?`;
    const dialogData = new ConfirmDialogModel('Confirm Delete', message);

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      maxWidth: '400px',
      data: dialogData
    });

    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult) {
        this.userHikesService.deleteHike(hikeId).subscribe(() => {
          this.getUserHikes();
        });
      }
    });
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

  hasError = (controlName: string, errorName: string) => {
    return this.trailForm.contains[controlName].hasError(errorName);
  }
}
