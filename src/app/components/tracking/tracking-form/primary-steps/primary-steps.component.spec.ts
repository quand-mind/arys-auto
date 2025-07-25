import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrimaryStepsComponent } from './primary-steps.component';

describe('PrimaryStepsComponent', () => {
  let component: PrimaryStepsComponent;
  let fixture: ComponentFixture<PrimaryStepsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrimaryStepsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PrimaryStepsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
