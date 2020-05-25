import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-sidebar-page-layout',
  templateUrl: './sidebar-page-layout.component.html',
  styleUrls: ['./sidebar-page-layout.component.css']
})
export class SidebarPageLayoutComponent {

  @Input()
  title:string;

  @Input()
  description:string;

  @Input()
  customDescription:boolean;

  @Input()
  breadcrumb:boolean;

  @Input()
  hideSidebar:boolean;

  constructor() { }
}
