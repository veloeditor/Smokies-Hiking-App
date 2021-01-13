import { Component, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { startWith, map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Trail } from '../../interfaces/trail';

import { UserHike } from '../../interfaces/user-hike';
import { UserHikesService } from '../../services/user-hikes.service';
import { TrailsService } from '../../services/trails.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent, ConfirmDialogModel } from '../confirm-dialog/confirm-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EventEmitter } from 'events';
import { MileageService } from 'src/app/services/mileage.service';

@Component({
  selector: 'app-trails-log',
  templateUrl: './trails-log.component.html',
  styleUrls: ['./trails-log.component.scss'],
})
export class TrailsLogComponent implements OnInit {

  trailForm: FormGroup;

  userHikes: UserHike[];
  addUser = false;
  enableEdit = false;
  enableEditIndex = null;
  pictureLink = '';
  randomNumber: number;

  trails: Trail[];
  hikedNames = [];
  hikedSectionNames = [];

  trailSelected: Trail;
  trailObjSelectedMiles = 0;
  sectionNameArray: [{sectionName: string, sectionLength: number}];
  userUniqueMilesHiked = null;
  selectedSection = [];
  extraMiles = null;

  filteredTrails: Observable<Trail[]>;

  numArr = Array.from(Array(5), (_, x) => x);

  constructor(
    private userHikesService: UserHikesService,
    private mileageService: MileageService,
    private fb: FormBuilder,
    private trailsService: TrailsService,
    public dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.getUserHikes();

    this.trailsService.getAllTrails().subscribe((data: any[]) => {
      this.trails = data;
    });
  }

  private getUserHikes() {
    this.userHikesService.getAllUserHikes().subscribe((data: any[]) => {
      this.userHikes = data;
      this.hiked();
      this.userHikes.sort((a, b) => new Date(a?.date) > new Date(b?.date) ? -1 : 1
      );
      const miles = this.userHikes.reduce((acc, userHike) => {
        return acc + Number(userHike.totalMiles);
      }, 0);
      this.userUniqueMilesHiked = miles.toFixed(1);
      this.userHikes.forEach(hike => {
        if (hike.photoUrl === '') {
          const randomPic = this.randomPictures();
          hike.photoUrl = randomPic;
        }
      });
    });
  }

  getRandomNumber() {
    console.log('getRandomNumber is firing');
    return (Math.floor(Math.random() * 100));
  }

  findOption(val: string) {
    const filterValue = val?.toString().toLowerCase();
    return this.trails.filter(option => option.name.toLowerCase().includes(filterValue));
  }

  get sections(): FormControl {
    return this.trailForm.get('sections') as FormControl;
  }

  editHike(userHike, e, i): void {
    this.enableEdit = true;
    this.addUser = false;
    this.enableEditIndex = i;
  }

  saveTrailForm(value: boolean): void {
    this.enableEdit = false;
    this.enableEditIndex = null;
    this.addUser = false;
    this.getUserHikes();
  }

  cancelEdit() {
    this.enableEdit = false;
    this.enableEditIndex = null;
  }

  deleteHike(userHike) {
    const hikeId = userHike.id;
    const message = `Are you sure you want to do delete the ${userHike.trailName} hike?`;
    const dialogData = new ConfirmDialogModel('Confirm Delete', message);

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      maxWidth: '500px',
      data: dialogData,
      panelClass: 'deleteSnack'
    });

    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult) {
        this.userHikesService.deleteHike(hikeId).subscribe(() => {
          this.getUserHikes();
        });
      }
    });
  }

  openForm() {
    this.addUser = !this.addUser;
    this.enableEdit = false;
    this.enableEditIndex = null;
  }

  hasError = (controlName: string, errorName: string) => {
    return this.trailForm.contains[controlName].hasError(errorName);
  }


  randomPictures() {
    const path = '../../../assets/img/';
    const picArray = ['bridge.jpg', 'jumpoff.jpg', 'trail_1.jpg', 'trail_2.jpg', 'mountains_illustration.png', 'shutterstock_226674508.png', 'sky-is-on-fire.jpeg',
                     'smokies-01.jpg', 'smokies-02.jpg', 'smokies-03.jpg', 'smokies-04.jpg', 'smokies-05.jpeg', 'smokies-06.jpeg', 'smokies-07.jpeg', 'smokies-08.jpeg',
                     'smokies-09.jpeg', 'smokies-10.jpeg', 'smokies-11.jpeg', 'smokies-12.jpeg'];
    const i = Math.floor(Math.random() * picArray.length);
    this.pictureLink = `${path}${picArray[i]}`;
    return this.pictureLink;
  }

  hiked() {
    this.userHikes?.forEach((hike) => {
      if (hike?.sections === null || hike.sections?.length < 1) {
        const trailName = hike.trailName;
        this.hikedNames.push(trailName);
      } else {
        hike?.sections?.forEach((section) => {
          const sectionName = section.sectionName;
          this.hikedSectionNames.push(sectionName);
        });
      }
    });
  }
}
