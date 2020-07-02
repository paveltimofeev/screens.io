import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DataAccessService } from './data-access.service';
import { environment } from '../../environments/environment';
import { FiltersService, IQueryFilter } from './filters.service';
import { IScenario } from '../models/app.models';

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

  run (opts: {
    scenarios?: string[],
    viewports?: string[]
  }): Observable<any> {

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

  getHistoryWithFilter (filter?: {key:string, value:string}): Observable<any> {

    const query = filter ? `?${filter.key}=${filter.value}` : ``;

    return this.dataAccessService.get(
      environment.api + 'test/history' + query);
  }
  getHistoryWithFilters (filters?: {key:string, value:string}[]): Observable<any> {

    let filtersAsObject = {};

    filters.forEach(f => {
      if (filtersAsObject[f.key] === undefined) {
        filtersAsObject[f.key] = [f.value]
      }
      else {
        filtersAsObject[f.key].push(f.value)
      }
    })

    let queryParts = Object
      .keys(filtersAsObject)
      .map(f => {

        if (Array.isArray(filtersAsObject[f])) {
          return `${f}=${filtersAsObject[f].join(',')}`
        }

        return `${f}=${filtersAsObject[f]}`
    })

    const query = queryParts.join('&');

    return this.dataAccessService.get(
      environment.api + 'test/history?' + query);
  }

  getScenarioHistory (scenarioId:string): Observable<any> {

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

  getEnabledViewports(): Observable<any> {

    return this.dataAccessService.get(
      environment.api + 'test/viewports?enabled=true')
  }

  getAllViewports(): Observable<any> {

    return this.dataAccessService.get(
      environment.api + 'test/viewports')
  }

  /* UPSERT */
  updateViewports(viewports:any[]):Observable<any> {

    return this.dataAccessService.put(
      environment.api + 'test/viewports', viewports)
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

  createScenario(scenario:IScenario): Observable<any> {

    if (!scenario)
      throw new Error('Wrong scenario: empty data')

    return this.dataAccessService.post(
      environment.api + 'test/scenario', scenario)
  }

  updateScenario(scenario:IScenario): Observable<any> {

    if (!scenario)
      throw new Error('Wrong scenario: empty data')

    if (!scenario._id)
      throw new Error('Wrong scenario: No _id')

    return this.dataAccessService.put(
      environment.api + 'test/scenario/' + scenario._id,
      scenario)
  }

  cloneScenario(scenarioId:string, newScenarioLabel:string): Observable<any> {

    if (!scenarioId)
      throw new Error('No scenarioId')

    return this.dataAccessService.post(
      environment.api + 'test/scenario/' + scenarioId + '/clone',
      {
        label: newScenarioLabel
      })
  }

  addScenarioToFavorite(scenario:IScenario): Observable<any> {

    if (!scenario)
      throw new Error('Wrong scenario: empty data')

    if (!scenario._id)
      throw new Error('Wrong scenario: No _id')

    return this.dataAccessService.post(
      environment.api + 'test/scenario/' + scenario._id + '/favorite')
  }

  removeScenarioToFavorites(scenario:IScenario): Observable<any> {

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

  /// Account Management Adapter?
  getAccountInfo(): Observable<any> {

    return this.dataAccessService.get(
      environment.auth + '/manage/account')
  }
  updateAccountInfo(accountInfo:any): Observable<any> {

    return this.dataAccessService.put(
      environment.auth + '/manage/account', accountInfo)
  }
  updatePassword(passwordInfo: { currentPassword: string, newPassword: string }): Observable<any> {

    return this.dataAccessService.put(
      environment.auth + '/manage/account/password', passwordInfo)
  }
  deleteAccount(accountInfo:{ password:string}): Observable<any> {

    return this.dataAccessService.delete(
      environment.auth + '/manage/account/', accountInfo)
  }

  signup (user:string, email:string, password:string): Observable<any> {

    return this.dataAccessService
      .post(environment.auth + '/signup-client',
        {user: user.trim(), email: email.trim(), password: password.trim()});
  }

  signin (email:string, password:string): Observable<any> {

    return this.dataAccessService
      .post(
        environment.auth + '/signin-client',
        {email: email.trim(), password: password.trim()}
      );
  }

  signout (): Observable<any> {

    return this.dataAccessService
      .post(environment.auth + '/signout-client');
  }
}
