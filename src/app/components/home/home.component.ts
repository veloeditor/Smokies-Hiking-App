import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { TrailsService } from '../../services/trails.service';
import { Trail } from '../../interfaces/trail';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  trails: Trail[];

  constructor(private trailsService: TrailsService) {
  }

  ngOnInit() {
    this.trailsService.sendGetRequest().subscribe((data: any[]) => {
      this.trails = data;
      console.log(this.trails);
    });
  }

}
