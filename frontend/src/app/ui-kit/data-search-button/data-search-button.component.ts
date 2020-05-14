import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';

@Component({
  selector: 'app-data-search-button',
  templateUrl: './data-search-button.component.html'
})
export class DataSearchButtonComponent  {

  value:string = '';
  editMode:boolean = false;

  @ViewChild('el')
  el:ElementRef;

  @Input()
  label:string;

  @Input()
  placeholder:string;

  @Output()
  changed:EventEmitter<string> = new EventEmitter();

  keyupHandler (val) {

    if (this.value == val.trim()) {
      return
    }

    this.value = val.trim();
    this.changed.emit(this.value);
  }

  editModeHandler () {
    this.editMode = true;
    setTimeout(() => { this.el.nativeElement.focus() }, 100)
  }

  closeClickHandler () {
    this.editMode = false;
    this.changed.emit()
  }
}
