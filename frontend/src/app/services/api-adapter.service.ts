import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DataAccessService } from './data-access.service';
import { environment } from '../../environments/environment';
import { FiltersService, IQueryFilter } from './filters.service';

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
    private dataAccessService: DataAccessService,
    private filtersService: FiltersService
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

  approveCase (testCase: {
    reportId: string,
    label: string,
    viewportLabel: string
  }): Observable<any> {

    return this.dataAccessService.post(
      environment.api + 'test/approvecase/',
      testCase);
  }

  getReport (runId:any): Observable<any> {

    return this.dataAccessService.get(
      environment.api + 'test/report/' + runId);
  }

  getHistoryRecord (jobId:string): Observable<any> {

    return this.dataAccessService.get(
      environment.api + 'test/history/' + jobId);
  }

  getHistory (filters?: IQueryFilter[], limit?:number): Observable<any> {

    let query = '';

    if (filters && filters.length > 0) {

      query = '?' + filters
        .map((filter: IQueryFilter) => {
          return this.filtersService.buildQuery(filter)
        })
        .filter(Boolean)
        .join('&');
    }
    if (limit && limit > 0) {

      query = query.length > 0 ? `${query}&limit=${limit}` : `?limit=${limit}`
    }

    return this.dataAccessService.get(
      environment.api + 'test/history' + query);
  }

  getTestCaseHistory (scenarioId:string): Observable<any> {

    if (!scenarioId)
      throw new Error('No scenarioId')

    return this.dataAccessService.get(
      environment.api + '/test/scenario/' + scenarioId + '/runs');
  }

  deleteHistoryRecord(recordId:string): Observable<any> {

    if (!recordId)
      throw new Error('Cannot delete history record: No recordId')


    return this.dataAccessService.delete(
      environment.api + 'test/history/' + recordId)
  }

  deleteAllHistoryRecords(): Observable<any> {
    return this.dataAccessService.delete(
      environment.api + 'test/histories')
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
      throw new Error('Wrong viewport: empty data')

    if (!viewport._id)
      throw new Error('Wrong viewport: No _id')


    return this.dataAccessService.delete(
      environment.api + 'test/viewport/' + viewport._id)
  }

  getScenarios(): Observable<any> {

    return this.dataAccessService.get(
      environment.api + 'test/scenarios')
  }

  getFavoriteScenarios(): Observable<any> {

    return this.dataAccessService.get(
      environment.api + 'test/scenarios?favorites=true')
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

  switchScenarioFavorite (scenarioId:any): Observable<any> {

    return this.dataAccessService.put(
      environment.api + 'test/scenario/' + scenarioId + '/favorite')
  }

  deleteScenario(scenarioId:any): Observable<any> {

    return this.dataAccessService.delete(
      environment.api + 'test/scenario/' + scenarioId)
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
