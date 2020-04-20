import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DataAccessService } from './data-access.service';
import { environment } from '../../environments/environment';

export interface IConfig {
  id:string,
  viewports: {width:number, height:number, label?:string}[],
  scenarios: any[]
}


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

    return this.dataAccessService.post(
      environment.api + 'test/run', opts);
  }

  approve (jobId:any): Observable<any> {

    return this.dataAccessService.post(
      environment.api + 'test/approve/' + jobId);
  }

  approveCase (pair:any): Observable<any> {

    return this.dataAccessService.post(
      environment.api + 'test/approvecase/',
      pair);
  }

  getReport (jobId:any): Observable<any> {

    return this.dataAccessService.get(
      environment.api + 'test/report/' + jobId);
  }

  getHistory (): Observable<any> {

    return this.dataAccessService.get(
      environment.api + 'test/history');
  }

  deleteHistoryRecord(recordId:string): Observable<any> {

    if (!recordId)
      throw new Error('Cannot delete history record: No recordId')


    return this.dataAccessService.delete(
      environment.api + 'test/history/' + recordId)
  }

  createViewport(viewport:any): Observable<any> {

    if (!viewport)
      throw new Error('Wrong viewport: empty data')

    return this.dataAccessService.post(
      environment.api + 'test/viewport', viewport)
  }

  getViewports(): Observable<any> {

    return this.dataAccessService.get(
      environment.api + 'test/viewports')
  }

  deleteViewport(viewport:any): Observable<any> {

    if (!viewport)
      throw new Error('Wrong scenario: empty data')

    if (!viewport._id)
      throw new Error('Wrong scenario: No _id')


    return this.dataAccessService.delete(
      environment.api + 'test/viewport/' + viewport._id)
  }

  getScenarios(): Observable<any> {

    return this.dataAccessService.get(
      environment.api + 'test/scenarios')
  }

  getScenario(id:string): Observable<any> {

    return this.dataAccessService.get(
      environment.api + 'test/scenario/' + id)
  }

  createScenario(scenario:any): Observable<any> {

    if (!scenario)
      throw new Error('Wrong scenario: empty data')

    return this.dataAccessService.post(
      environment.api + 'test/scenario', scenario)
  }

  updateScenario(scenario:any): Observable<any> {

    if (!scenario)
      throw new Error('Wrong scenario: empty data')

    if (!scenario._id)
      throw new Error('Wrong scenario: No _id')

    return this.dataAccessService.put(
      environment.api + 'test/scenario/' + scenario._id,
      scenario)
  }

  cloneScenario(scenario:any): Observable<any> {

    if (!scenario)
      throw new Error('Wrong scenario: empty data')

    if (!scenario._id)
      throw new Error('Wrong scenario: No _id')

    return this.dataAccessService.post(
      environment.api + 'test/scenario/' + scenario._id + '/clone',
      {
        label: scenario.label + ' ' + (new Date()).toLocaleString()
      })
  }

  addScenarioToFavorite(scenario:any): Observable<any> {

    if (!scenario)
      throw new Error('Wrong scenario: empty data')

    if (!scenario._id)
      throw new Error('Wrong scenario: No _id')

    return this.dataAccessService.post(
      environment.api + 'test/scenario/' + scenario._id + '/favorite')
  }

  removeScenarioToFavorites(scenario:any): Observable<any> {

    if (!scenario)
      throw new Error('Wrong scenario: empty data')

    if (!scenario._id)
      throw new Error('Wrong scenario: No _id')

    return this.dataAccessService.delete(
      environment.api + 'test/scenario/' + scenario._id + '/favorite')
  }

  deleteScenario(scenario:any): Observable<any> {

    if (!scenario)
      throw new Error('Wrong scenario: empty data')

    if (!scenario._id)
      throw new Error('Wrong scenario: No _id')

    return this.dataAccessService.delete(
      environment.api + 'test/scenario/' + scenario._id)
  }

  signup (user, password): Observable<any> {

    return this.dataAccessService
      .post(environment.auth + '/signup-client',
        {user, password});
  }

  signin (user, password): Observable<any> {

    return this.dataAccessService
      .post(environment.auth + '/signin-client',
        {user, password});
  }

  signout (): Observable<any> {

    return this.dataAccessService
      .post(environment.auth + '/signout-client');
  }
}
