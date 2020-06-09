import { Injectable } from '@angular/core';
import { Observable, throwError, timer } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, finalize, mergeMap, retryWhen, take } from 'rxjs/operators';
import { Router } from '@angular/router';


interface RetryOpts {
  maxRetryAttempts?: number,
  scalingDuration?: number,
  excludedStatusCodes?: number[]
}

// https://www.learnrxjs.io/learn-rxjs/operators/error_handling/retrywhen
export const genericRetryStrategy = ({ maxRetryAttempts = 3, scalingDuration = 1000, excludedStatusCodes = []}: RetryOpts = {}) => (attempts: Observable<any>) => {
  return attempts.pipe(

    mergeMap((error, i) => {

      const retryAttempt = i + 1;

      if (retryAttempt > maxRetryAttempts || excludedStatusCodes.find(e => e === error.status) || error.name === "SyntaxError") {
        console.error(error.message, error);
        return throwError(error);
      }

      let delay = (retryAttempt + Math.random()) * scalingDuration;
      console.log(`Attempt ${retryAttempt}/${maxRetryAttempts}: retrying in ${delay}ms`);

      return timer(delay);
    }),
    finalize(() => {
      //console.log('We are done!')
    })
  );
};


@Injectable({
  providedIn: 'root'
})
export class DataAccessService {

  retryOpts = {
    maxRetryAttempts: 10,
    scalingDuration: 2000,
    excludedStatusCodes: [401, 403, 404, 409, 500, 502, 503, 523, 525, 526]
  };

  constructor(private http: HttpClient, private router: Router) { }

  /// https://angular.io/guide/http#error-handling
  handleError (error: HttpErrorResponse) {

    if (error.error instanceof ErrorEvent) {
      console.error('client side or network error')
    }
    else {

      if (error.status === 401) {
        this.router.navigate(['/login'])
      }
      console.error(`Response error: StatusCode ${error.status}, ${error.message} `)

      return throwError(`Network error. StatusCode ${error.status}`);
    }

    return throwError(`Network error`);
  }

  get (url:string): Observable<any> {
    return this.http.get(url, {withCredentials: true}).pipe(
      take(1),
      retryWhen(genericRetryStrategy(this.retryOpts)),
      catchError(this.handleError.bind(this))
    );
  }

  post (url:string, body:any = {}): Observable<any> {
    return this.http.post(url, body, {withCredentials: true}).pipe(
      take(1),
      retryWhen(genericRetryStrategy(this.retryOpts)),
      catchError(this.handleError.bind(this))
    );
  }

  put (url:string, body:any = {}): Observable<any> {
    return this.http.put(url, body, {withCredentials: true}).pipe(
      take(1),
      retryWhen(genericRetryStrategy(this.retryOpts)),
      catchError(this.handleError.bind(this))
    );
  }

  delete (url:string, body?:any): Observable<any> {
    return this.http.delete(url, {withCredentials: true}).pipe(
      take(1),
      retryWhen(genericRetryStrategy(this.retryOpts)),
      catchError(this.handleError.bind(this))
    );
  }
}
