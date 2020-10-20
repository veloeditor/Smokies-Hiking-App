import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { UserHike } from '../interfaces/user-hike';

@Injectable({
  providedIn: 'root'
})
export class UserHikesService {

  private REST_API_SERVER = 'http://localhost:3000/userHikes';

  userHikes$: BehaviorSubject<UserHike[]> = new BehaviorSubject<UserHike[]>(null);

  constructor(private httpClient: HttpClient) { }

  public getAllUserHikes() {
    return this.httpClient.get(this.REST_API_SERVER);
  }

  
}


