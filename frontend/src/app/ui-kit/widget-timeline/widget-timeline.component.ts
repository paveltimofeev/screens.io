import { Component, Input } from '@angular/core';
import { WidgetComponent } from '../widget/widget.component';

export interface IBarItem {
  percent: number,
  highlighted: boolean,
  tooltip: string
}

@Component({
  selector: 'app-widget-timeline',
  templateUrl: './widget-timeline.component.html'
})
export class WidgetTimelineComponent extends WidgetComponent {

  @Input()
  passedPercent:number;

  @Input()
  delta:string;

  @Input()
  chartData: IBarItem[];

}
