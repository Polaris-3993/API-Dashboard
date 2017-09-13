import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActionSetupComponent } from './action-setup.component';

describe('ActionSetupComponent', () => {
  let component: ActionSetupComponent;
  let fixture: ComponentFixture<ActionSetupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActionSetupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActionSetupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
