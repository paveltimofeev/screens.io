import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-form-button',
  templateUrl: './form-button.component.html'
})
export class FormButtonComponent {

  @Input()
  isDisabled: any;

  @Input()
  inProgress: any;

  @Input()
  isPrimary: any;

  @Input()
  isDanger: any;

  @Output()
  clickButton: EventEmitter<any> = new EventEmitter();

  clickHandler () {

    this.clickButton.emit()
  }
}
