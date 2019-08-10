import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckExerciseComponent } from './check-exercise.component';

describe('CheckExerciseComponent', () => {
  let component: CheckExerciseComponent;
  let fixture: ComponentFixture<CheckExerciseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CheckExerciseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckExerciseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
