import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-top-menu',
  templateUrl: './top-menu.component.html',
  styleUrls: ['./top-menu.component.css']
})
export class TopMenuComponent {

  @Output()
  onActionClick:EventEmitter<string> = new EventEmitter();
}
