import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-widget-label',
  templateUrl: './widget-label.component.html'
})
export class WidgetLabelComponent {

  @Input()
  state:string;

  @Input()
  scenarios:number;

  @Input()
  viewports:number;

  @Input()
  lastRun:string;
}
