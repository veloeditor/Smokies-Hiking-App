import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { Trail } from '../interfaces/trail';

@Injectable({
  providedIn: 'root'
})
export class TrailsService {

  private REST_API_SERVER = 'http://localhost:3000/trails';

  trails$: BehaviorSubject<Trail[]> = new BehaviorSubject<Trail[]>(null);

  constructor(private httpClient: HttpClient) { }

  public getAllTrails() {
    return this.httpClient.get(this.REST_API_SERVER);
  }

  public getTrail(id): Observable<any> {
    return this.httpClient.get(`${this.REST_API_SERVER}/${id}`);
  }

  handleError(error: HttpErrorResponse) {
    let errorMessage = 'Unknown error!';
    if (error.error instanceof ErrorEvent) {
      // client-side errors
      errorMessage = 'Error: ${error.error.message}';
    } else {
      // servier-side errors
      errorMessage = 'Error Code: ${error.status}\nMessage: ${error.message}';
    }
    window.alert(errorMessage);
    return throwError(errorMessage);
  }

}
