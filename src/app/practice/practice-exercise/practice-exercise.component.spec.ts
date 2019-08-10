import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PracticeExerciseComponent } from './practice-exercise.component';

describe('PracticeExerciseComponent', () => {
  let component: PracticeExerciseComponent;
  let fixture: ComponentFixture<PracticeExerciseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PracticeExerciseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PracticeExerciseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
