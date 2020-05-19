import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { cleanupNgrxStorage } from '../configuration/store/configuration.actions';

@Component({
  selector: 'app-scenario-page',
  templateUrl: './scenario-page.component.html',
  styleUrls: ['./scenario-page.component.css']
})
export class ScenarioPageComponent implements OnInit, OnDestroy {

  id:string;

  constructor(private route:ActivatedRoute) { }

  ngOnInit() {
    this.id = this.route.snapshot.params.id;
  }

  ngOnDestroy () {
    //this.store.dispatch(cleanupNgrxStorage())
  }
}
