import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectorsBoxComponent } from './selectors-box.component';

describe('SelectorsBoxComponent', () => {
  let component: SelectorsBoxComponent;
  let fixture: ComponentFixture<SelectorsBoxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectorsBoxComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectorsBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
