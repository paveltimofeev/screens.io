import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-widget',
  templateUrl: './widget.component.html',
  styleUrls: ['./widget.component.css']
})
export class WidgetComponent {

  @Input()
  title:string;

  @Input()
  isLargeContent:boolean;

  @Input()
  isAccentValue:boolean;

  @Input()
  bgColor:string;

}
