import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TrailsService {

  private REST_API_SERVER = 'http://localhost:3000/trails';

  constructor(private httpClient: HttpClient) { }

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

  public getAllTrails() {
    return this.httpClient.get(this.REST_API_SERVER);
  }
}
