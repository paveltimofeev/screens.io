import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-scenario-card',
  templateUrl: './scenario-card.component.html',
  styleUrls: ['./scenario-card.component.css']
})
export class ScenarioCardComponent {

  @Input()
  title:string;

  @Input()
  screenshot:string;

  @Input()
  isFailed:boolean = false;


  // @Output()
  // cardClick:EventEmitter<string> = new EventEmitter();

  @Output()
  runClick:EventEmitter<string> = new EventEmitter();

}
