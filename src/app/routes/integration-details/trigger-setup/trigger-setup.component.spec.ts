import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TriggerSetupComponent } from './trigger-setup.component';

describe('TriggerSetupComponent', () => {
  let component: TriggerSetupComponent;
  let fixture: ComponentFixture<TriggerSetupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TriggerSetupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TriggerSetupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
