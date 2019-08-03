import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LookUserComponent } from './look-user.component';

describe('LookUserComponent', () => {
  let component: LookUserComponent;
  let fixture: ComponentFixture<LookUserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LookUserComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LookUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
