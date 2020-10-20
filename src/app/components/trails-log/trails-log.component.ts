import { Component, OnInit } from '@angular/core';
import { UserHike } from 'src/app/interfaces/user-hike';
import { UserHikesService } from 'src/app/services/user-hikes.service';

@Component({
  selector: 'app-trails-log',
  templateUrl: './trails-log.component.html',
  styleUrls: ['./trails-log.component.scss']
})
export class TrailsLogComponent implements OnInit {

  userHikes: UserHike[];

  constructor(private userHikesService: UserHikesService) { }

  ngOnInit(): void {
    this.userHikesService.getAllUserHikes().subscribe((data: any[]) => {
      this.userHikes = data;
    });
  }

}
