import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  trails: Observable<any[]>;
  sections: Observable<any[]>;

  objectKeys(obj) {
    return Object.keys(obj);
  }

  constructor(db: AngularFireDatabase) {
    this.trails = db.list('trails').valueChanges();
    this.sections = db.list('trails/sections').valueChanges();
   }

  ngOnInit(): void {
  }

}
