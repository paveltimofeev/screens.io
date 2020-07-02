import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-confirmation',
  templateUrl: './confirmation.component.html'
})
export class ConfirmationComponent {

  opened:boolean;

  @Output()
  confirmed: EventEmitter<boolean> = new EventEmitter();

  @Output()
  confirmationOpened: EventEmitter<boolean> = new EventEmitter();

  toggleHandler () {
    this.opened = !this.opened;
    this.confirmationOpened.emit(this.opened);
  }
}
