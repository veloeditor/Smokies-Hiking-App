import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { UserHike } from '../interfaces/user-hike';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserHikesService {

  private REST_API_SERVER = 'http://localhost:3000/userHikes';

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  userHikes$: BehaviorSubject<UserHike[]> = new BehaviorSubject<UserHike[]>(null);

  constructor(private httpClient: HttpClient) { }

  public getAllUserHikes() {
    return this.httpClient.get(this.REST_API_SERVER);
  }

  postHike(hike: UserHike): Observable<UserHike> {
    return this.httpClient.post<UserHike>(this.REST_API_SERVER, JSON.stringify(hike), this.httpOptions)
    .pipe(
      catchError(this.errorHandler)
    );
  }

  updateHike(userHike: UserHike): Observable<UserHike> {
    const url = `${this.REST_API_SERVER}/${userHike.id}`;
    return this.httpClient.put<UserHike>(url, userHike, this.httpOptions).pipe(
      map(() => userHike),
      catchError(this.errorHandler)
    );
  }

  deleteHike(id: number): Observable<UserHike> {
    const url = `${this.REST_API_SERVER}/${id}`;
    return this.httpClient.delete<UserHike>(url, this.httpOptions).pipe(
      catchError(this.errorHandler)
    );
  }

  errorHandler(error) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // Get client-side error
      errorMessage = error.error.message;
    } else {
      // Get server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.log(errorMessage);
    return throwError(errorMessage);
 }
}

