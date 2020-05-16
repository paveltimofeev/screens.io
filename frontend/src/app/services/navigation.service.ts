import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class NavigationService {

  constructor(private router: Router) { }

  openScenario(scenarioId:string) {

    this.router.navigate(['scenario', scenarioId])
  }

  openScenarioHistory(scenarioId:string) {

    this.router.navigate(['job', scenarioId])
  }

  openNewScenario() {
    this.router.navigate(['scenario', 'new'])
  }
}
