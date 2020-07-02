import { Component, ElementRef, Input, ViewChild } from '@angular/core';

@Component({
  selector: 'app-more',
  templateUrl: './more.component.html'
})
export class MoreComponent {

  id:string;
  _value: string;
  hasMore: boolean;
  moreNumber: number;
  moreValues: string;

  @ViewChild('checkbox')
  checkbox: ElementRef;

  @Input()
  set values (value:string[]) {

    this._value = value[0];

    if (value.length > 1) {

      this.moreNumber = value.length - 1;
      this.hasMore = this.moreNumber > 0;
      this.moreValues = value.slice(1, value.length).join('\r\n')
    }
  }

  constructor () {
    this.id = "more" + Math.random();
  }

  clickHandler (event: MouseEvent) {

    this.checkbox.nativeElement.checked = !this.checkbox.nativeElement.checked;
    event.stopPropagation(); // also requires '; false' in markup
  }
}
