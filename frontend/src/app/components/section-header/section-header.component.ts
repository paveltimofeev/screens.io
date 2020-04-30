import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-section-header',
  templateUrl: './section-header.component.html',
  styleUrls: ['./section-header.component.css']
})
export class SectionHeaderComponent{

  @Input()
  icon:string;

  @Input()
  text:string;

  @Input()
  actions: string[];

  @Output()
  actionClick: EventEmitter<string> = new EventEmitter();

  actionClickHandler (action: string) {
    this.actionClick.emit(action)
  }
}
