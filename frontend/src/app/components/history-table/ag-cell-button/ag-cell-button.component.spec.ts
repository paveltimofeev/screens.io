import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AgCellButtonComponent } from './ag-cell-button.component';

describe('AgCellButtonComponent', () => {
  let component: AgCellButtonComponent;
  let fixture: ComponentFixture<AgCellButtonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AgCellButtonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AgCellButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
