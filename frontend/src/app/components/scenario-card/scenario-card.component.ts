import { Component, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-scenario-card',
  templateUrl: './scenario-card.component.html',
  styleUrls: ['./scenario-card.component.css']
})
export class ScenarioCardComponent implements OnInit {

  @Input()
  title:string;

  @Input()
  screenshot:string;

  @Input()
  isFailed:boolean = false;


  @Output()
  cardClick:any;

  @Output()
  runClick:any;

  constructor() { }

  ngOnInit() {
  }

}
