import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InsideStepsComponent } from './inside-steps.component';

describe('InsideStepsComponent', () => {
  let component: InsideStepsComponent;
  let fixture: ComponentFixture<InsideStepsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InsideStepsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InsideStepsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
