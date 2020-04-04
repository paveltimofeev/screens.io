import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DataAccessService } from './data-access.service';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiAdapterService {

  constructor (
    private dataAccessService: DataAccessService
  ) { }

  /*
  [post] /api/test/run           <-  { error, data }
  [post] /api/approve/:jobId     <-  { status: 'approved' }
  [get] /api/test/report/:jobId <-  { error, report }
  [get] /api/test/history       <-  { error, jobs }
  [get] /api/test/config        <-  { error, data }
  [put] /api/test/config        <-  { error, data }
  */

  run (opts:any): Observable<any> {
    return this.dataAccessService.post( environment.api + 'test/run', opts);
  }

  approve (jobId:any): Observable<any> {
    return this.dataAccessService.post( environment.api + 'test/approve/' + jobId);
  }

  approveCase (pair:any): Observable<any> {

    return this.dataAccessService.post( environment.api + 'test/approvecase/', pair);
  }

  getReport (jobId:any): Observable<any> {
    return this.dataAccessService.get( environment.api + 'test/report/' + jobId);
  }

  getHistory (): Observable<any> {
    return this.dataAccessService.get( environment.api + 'test/history');
  }

  getConfig (): Observable<any> {
    return this.dataAccessService.get( environment.api + 'test/config');
  }

  updateConfig (config: IConfig): Observable<any> {
    return this.dataAccessService.put( environment.api + 'test/config', config);
  }

  deleteScenario (label: string): Observable<any> {
    return this.dataAccessService.put( environment.api + 'test/scenario', {label:label});
  }
}


export interface IConfig {
  id:string,
  viewports: any[],
  scenarios: any[]
}
