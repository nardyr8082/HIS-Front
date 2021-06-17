import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TraceAccessPageComponent } from './trace-access-page.component';

describe('TraceAccessPageComponent', () => {
  let component: TraceAccessPageComponent;
  let fixture: ComponentFixture<TraceAccessPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TraceAccessPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TraceAccessPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
