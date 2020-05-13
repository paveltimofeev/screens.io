import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-data-action-button',
  templateUrl: './data-action-button.component.html',
  styleUrls: ['./data-action-button.component.css']
})
export class DataActionButtonComponent{

  @Input()
  label:string;

  @Input()
  icon:string;

  @Output()
  clicked:EventEmitter<string> = new EventEmitter<string>();
}
