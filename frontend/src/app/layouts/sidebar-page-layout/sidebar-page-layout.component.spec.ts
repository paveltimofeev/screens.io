import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SidebarPageLayoutComponent } from './sidebar-page-layout.component';

describe('SidebarPageLayoutComponent', () => {
  let component: SidebarPageLayoutComponent;
  let fixture: ComponentFixture<SidebarPageLayoutComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SidebarPageLayoutComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SidebarPageLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
