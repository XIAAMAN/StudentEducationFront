import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagePermisComponent } from './manage-permis.component';

describe('ManagePermisComponent', () => {
  let component: ManagePermisComponent;
  let fixture: ComponentFixture<ManagePermisComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManagePermisComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManagePermisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
