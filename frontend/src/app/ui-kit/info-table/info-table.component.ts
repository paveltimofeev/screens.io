import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-info-table',
  templateUrl: './info-table.component.html'
})
export class InfoTableComponent {

  @Input()
  items: any;

  @Input()
  labelsAndProps: {label:string, prop:string, chips:boolean}[];

}
