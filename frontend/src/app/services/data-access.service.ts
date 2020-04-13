import { Injectable } from '@angular/core';
import { Observable, throwError, timer } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, finalize, mergeMap, retryWhen, take } from 'rxjs/operators';


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

      if (retryAttempt > maxRetryAttempts || excludedStatusCodes.find(e => e === error.status)) {
        return throwError(error);
      }

      let delay = (retryAttempt + Math.random()) * scalingDuration;
      console.log(`Attempt ${retryAttempt}: retrying in ${delay}ms`);

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
    maxRetryAttempts: 20,
    scalingDuration: 2000,
    excludedStatusCodes: [401, 403, 404, 409, 500, 502, 503, 523, 525, 526]
  };

  constructor(private http: HttpClient) { }

  /// https://angular.io/guide/http#error-handling
  handleError (error: HttpErrorResponse) {

    if (error.error instanceof ErrorEvent) {
      console.log('client side or network error')
    }
    else {
      console.log(`Response error: StatusCode ${error.status}, ${error.message} `)
    }

    return throwError('Network error');
  }

  get (url:string): Observable<any> {
    return this.http.get(url, {withCredentials: true}).pipe(
      take(1),
      retryWhen(genericRetryStrategy(this.retryOpts)),
      catchError(this.handleError)
    );
  }

  post (url:string, body:any = {}): Observable<any> {
    return this.http.post(url, body, {withCredentials: true}).pipe(
      take(1),
      retryWhen(genericRetryStrategy(this.retryOpts)),
      catchError(this.handleError)
    );
  }

  put (url:string, body:any = {}): Observable<any> {
    return this.http.put(url, body, {withCredentials: true}).pipe(
      take(1),
      retryWhen(genericRetryStrategy(this.retryOpts)),
      catchError(this.handleError)
    );
  }

  delete (url:string): Observable<any> {
    return this.http.delete(url, {withCredentials: true}).pipe(
      take(1),
      retryWhen(genericRetryStrategy(this.retryOpts)),
      catchError(this.handleError)
    );
  }
}
