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
  error:string;

  @Input()
  isPasswordField: boolean;

  @Input()
  description:string;

  @Input()
  placeholder:string;

  @Input()
  fieldIcon:string;

  @Input()
  defaultValue:string;

  @Input()
  fieldSize: string = '350'; // 150 | 350 | 500 | full

  @Output()
  iconClick:EventEmitter<string> = new EventEmitter();


  /**
   * To implement two-way binding there should be pair of Input and Output props,
   * and Output prop should have the same name as Input plus 'Change' suffix,
   * like this:
   *  input - 'value', output - 'valueChange',
   * In this case value property could be used as [(value)], like: '<app-text-field [(value)]="someField"></app-text-field>'
   * */
  @Input()
  value:string;

  @Output()
  valueChange:EventEmitter<string> = new EventEmitter();


  ngModelChangeHandler(e) {
    this.valueChange.emit(this.value)
  }

  clearValueHandler () {
    this.value = '';
    this.ngModelChangeHandler(this.value);
  }

  resetValueHandler () {
    this.value = this.defaultValue;
    this.ngModelChangeHandler(this.value);
  }
}
