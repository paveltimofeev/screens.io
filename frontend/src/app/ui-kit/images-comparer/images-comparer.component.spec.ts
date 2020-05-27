import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImagesComparerComponent } from './images-comparer.component';

describe('ImagesComparerComponent', () => {
  let component: ImagesComparerComponent;
  let fixture: ComponentFixture<ImagesComparerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImagesComparerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImagesComparerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
