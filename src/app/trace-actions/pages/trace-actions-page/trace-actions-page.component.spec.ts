import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TraceActionsPageComponent } from './trace-actions-page.component';

describe('TraceActionsPageComponent', () => {
  let component: TraceActionsPageComponent;
  let fixture: ComponentFixture<TraceActionsPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TraceActionsPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TraceActionsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
