import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-card-lg',
  templateUrl: './card-lg.component.html'
})
export class CardLgComponent {

  @Input()
  label: string;

  @Input()
  imageUrl: string;

  @Input()
  viewports: string[];

  @Input()
  status: string;

  @Input()
  errorMessage: string;

  @Input()
  hoverImageUrl: string;
  @Input()
  switchOnMouseOver: boolean = false;


  @Output()
  clickCard:EventEmitter<string> = new EventEmitter();

  @Output()
  clickApprove:EventEmitter<string> = new EventEmitter();

  @Output()
  clickLabel:EventEmitter<string> = new EventEmitter();

  @Output()
  clickViewport:EventEmitter<string> = new EventEmitter();

}
