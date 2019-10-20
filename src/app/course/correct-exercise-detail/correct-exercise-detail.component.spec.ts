import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CorrectExerciseDetailComponent } from './correct-exercise-detail.component';

describe('CorrectExerciseDetailComponent', () => {
  let component: CorrectExerciseDetailComponent;
  let fixture: ComponentFixture<CorrectExerciseDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CorrectExerciseDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CorrectExerciseDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
