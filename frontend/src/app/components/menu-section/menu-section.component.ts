import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-menu-section',
  templateUrl: './menu-section.component.html',
  styleUrls: ['./menu-section.component.css']
})
export class MenuSectionComponent {

  @Input()
  theme:string;

  @Input()
  icon:string;

  @Input()
  header:string;

  @Input()
  items:string[] = [];

  @Input()
  selected:string;

  @Output()
  itemClick:EventEmitter<string> = new EventEmitter();

  @Output()
  addClick:EventEmitter<string> = new EventEmitter();
}
