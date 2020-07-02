import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-card-md',
  templateUrl: './card-md.component.html'
})
export class CardMdComponent {

  waitDeletionConfirm:boolean;

  @Input()
  itemId:string;

  @Input()
  imageUrl:string;

  @Input()
  header:string;

  @Input()
  state:string;

  @Input()
  isFavorite:boolean;

  @Input()
  fullHeightModeOn: boolean = false;

  @Input()
  runs:boolean[];

  @Output()
  clickRun:EventEmitter<string> = new EventEmitter();

  @Output()
  clickCard:EventEmitter<string> = new EventEmitter();

  @Output()
  clickFavorite:EventEmitter<string> = new EventEmitter();

  @Output()
  clickDelete:EventEmitter<string> = new EventEmitter();
}
