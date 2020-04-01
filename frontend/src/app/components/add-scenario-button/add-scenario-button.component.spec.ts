import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddScenarioButtonComponent } from './add-scenario-button.component';

describe('AddScenarioButtonComponent', () => {
  let component: AddScenarioButtonComponent;
  let fixture: ComponentFixture<AddScenarioButtonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddScenarioButtonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddScenarioButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
