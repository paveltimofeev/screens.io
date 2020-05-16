import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-scenario-page',
  templateUrl: './scenario-page.component.html',
  styleUrls: ['./scenario-page.component.css']
})
export class ScenarioPageComponent implements OnInit {

  id:string;

  constructor(private route:ActivatedRoute) { }

  ngOnInit() {
    this.id = this.route.snapshot.params.id;
  }
}
