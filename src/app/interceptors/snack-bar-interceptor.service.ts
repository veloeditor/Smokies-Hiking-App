import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse
} from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SnackBarInterceptorService implements HttpInterceptor {

  constructor(private snackBar: MatSnackBar) { }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      tap(event => {
        if (event instanceof HttpResponse && event.status === 200 || 201) {
          if (request.method === 'POST') {
            const postMessage = 'Your hike was added successfully!';
            this.snackBar.open(postMessage, 'Close',
            {duration: 4000, panelClass: 'successSnack'});
          }
          if (request.method === 'PUT') {
            const editMessage = 'Your hike was updated successfully!';
            this.snackBar.open(editMessage, 'Close',
            {duration: 4000, panelClass: 'successSnack'});
          }
          else if (request.method === 'DELETE') {
            const deleteMessage = 'You successfully deleted your hike.';
            this.snackBar.open(deleteMessage, 'Close',
            {duration: 4000, panelClass: 'deleteSnack'});
          }
        }
      }),
      catchError(error => {
        this.snackBar.open('An error occurred. Please try again.', 'Close', {duration: 4000, panelClass: 'errorSnack'});
        return throwError(error);
      })
    );
  }
}
