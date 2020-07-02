import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-checkbox-field',
  templateUrl: './checkbox-field.component.html'
})
export class CheckboxFieldComponent  {

  @Input()
  label:string;

  @Input()
  checked:boolean;

  @Output()
  changed:EventEmitter<boolean> = new EventEmitter();
}
