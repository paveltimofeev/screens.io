import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-data-search-button',
  templateUrl: './data-search-button.component.html'
})
export class DataSearchButtonComponent  {

  value:string = '';

  editMode:boolean = false;

  @Input()
  label:string;

  @Output()
  changed:EventEmitter<string> = new EventEmitter();

  keyupHandler (val) {

    if (this.value == val.trim()) {
      return
    }

    this.value = val.trim();
    this.changed.emit(this.value);
  }

  closeClickHandler () {
    this.editMode = false;
    this.changed.emit()
  }
}
