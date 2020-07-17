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

  constructor(db: AngularFireDatabase) {
    this.trails = db.list('trails').valueChanges();
   }

  ngOnInit(): void {
  }

}
