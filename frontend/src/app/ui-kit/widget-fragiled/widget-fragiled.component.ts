import { Component, EventEmitter, Input, Output } from '@angular/core';
import { WidgetComponent } from '../widget/widget.component';

@Component({
  selector: 'app-widget-fragiled',
  templateUrl: './widget-fragiled.component.html'
})
export class WidgetFragiledComponent extends WidgetComponent {

  @Input()
  scenarioId:string;

  @Input()
  scenarioName:string;

  @Input()
  failsPercent:number;

  @Input()
  imageUrl:string;

  @Output()
  clickOnImage:EventEmitter<string> = new EventEmitter();
}
