import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LookScoreComponent } from './look-score.component';

describe('LookScoreComponent', () => {
  let component: LookScoreComponent;
  let fixture: ComponentFixture<LookScoreComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LookScoreComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LookScoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
