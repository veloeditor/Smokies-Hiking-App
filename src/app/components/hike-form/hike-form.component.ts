import { Component, Input, OnInit } from '@angular/core';
import { UserHike } from 'src/app/interfaces/user-hike';

@Component({
  selector: 'app-hike-form',
  templateUrl: './hike-form.component.html',
  styleUrls: ['./hike-form.component.scss']
})
export class HikeFormComponent implements OnInit {

  @Input() userHike: UserHike;

  constructor() { }

  ngOnInit(): void {
  }

}
