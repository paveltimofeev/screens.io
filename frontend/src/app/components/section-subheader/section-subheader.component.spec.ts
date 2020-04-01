import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SectionSubheaderComponent } from './section-subheader.component';

describe('SectionSubheaderComponent', () => {
  let component: SectionSubheaderComponent;
  let fixture: ComponentFixture<SectionSubheaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SectionSubheaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SectionSubheaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
