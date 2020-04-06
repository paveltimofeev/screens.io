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
    return this.http.get(url, {withCredentials: true});
  }

  post (url:string, body:any = {}): Observable<any> {
    return this.http.post(url, body, {withCredentials: true});
  }

  put (url:string, body:any = {}): Observable<any> {
    return this.http.put(url, body, {withCredentials: true});
  }
}
