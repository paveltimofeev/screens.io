import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-section-subheader',
  templateUrl: './section-subheader.component.html',
  styleUrls: ['./section-subheader.component.css']
})
export class SectionSubheaderComponent {

  @Input()
  text:string;

  constructor() { }

}
