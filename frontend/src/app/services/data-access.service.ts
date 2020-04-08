import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DataAccessService {

  constructor(private http: HttpClient) { }

  get (url:string): Observable<any> {
    return this.http.get(url, {withCredentials: true}).pipe(take(1));
  }

  post (url:string, body:any = {}): Observable<any> {
    return this.http.post(url, body, {withCredentials: true}).pipe(take(1));
  }

  put (url:string, body:any = {}): Observable<any> {
    return this.http.put(url, body, {withCredentials: true}).pipe(take(1));
  }
}
