import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DataAccessService {

  constructor(private http: HttpClient) { }

  get (url:string): Observable<any> {
    return this.http.get(url);
  }

  post (url:string, body:any = {}): Observable<any> {
    return this.http.post(url, body);
  }

  put (url:string, body:any = {}): Observable<any> {
    return this.http.post(url, body);
  }
}
