import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-text-field',
  templateUrl: './text-field.component.html'
})
export class TextFieldComponent {

  @Input()
  label:string;

  @Input()
  tooltip:string;

  @Input()
  description:string;

  @Input()
  placeholder:string;

  @Input()
  fieldIcon:string;

  @Input()
  value:string;

  @Output()
  valueChanged:EventEmitter<string> = new EventEmitter();

  ngModelChangeHandler(e) {
    this.valueChanged.emit(e)
  }
}
