import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class NavigationService {

  constructor(private router: Router) { }


  /// SCENARIO
  openScenarios() {
    this.router.navigate(['scenarios'])
  }
  openNewScenario() {
    this.router.navigate(['scenario', 'new'])
  }
  openScenario(scenarioId:string) {

    this.router.navigate(['scenario', scenarioId])
  }


  /// JOB

  openScenarioHistory(scenarioId:string) {

    this.router.navigate(['job', scenarioId])
  }
  openComparer(jobId:string, caseIdx:number) {

    this.router.navigate(['job', jobId, 'compare', caseIdx])
  }
}
