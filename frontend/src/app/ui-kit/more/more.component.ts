import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-more',
  templateUrl: './more.component.html'
})
export class MoreComponent {

  _value: string;
  hasMore: boolean;
  moreNumber: number;
  moreValues: string;

  @Input()
  set values (value:string[]) {

    this._value = value[0];

    if (value.length > 1) {

      this.moreNumber = value.length - 1;
      this.hasMore = this.moreNumber > 0;
      this.moreValues = value.slice(1, value.length).join(', ')
    }
  }
}
