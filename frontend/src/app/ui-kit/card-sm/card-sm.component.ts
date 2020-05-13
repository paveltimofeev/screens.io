import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-card-sm',
  templateUrl: './card-sm.component.html'
})
export class CardSmComponent{

  @Input()
  itemId:string;

  @Input()
  imageUrl:string;

  @Input()
  header:string;

  @Input()
  isPassed:boolean;

  @Input()
  viewports:string[];

  @Output()
  clickRun:EventEmitter<string> = new EventEmitter();

  @Output()
  clickHistory:EventEmitter<string> = new EventEmitter();

  @Output()
  clickCard:EventEmitter<string> = new EventEmitter();

}
