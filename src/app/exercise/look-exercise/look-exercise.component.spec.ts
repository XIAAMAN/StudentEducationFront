import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LookExerciseComponent } from './look-exercise.component';

describe('LookExerciseComponent', () => {
  let component: LookExerciseComponent;
  let fixture: ComponentFixture<LookExerciseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LookExerciseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LookExerciseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
