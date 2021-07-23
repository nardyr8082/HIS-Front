import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BatchDistributionFormComponent } from './batch-distribution-form.component';

describe('BatchDistributionFormComponent', () => {
  let component: BatchDistributionFormComponent;
  let fixture: ComponentFixture<BatchDistributionFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BatchDistributionFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BatchDistributionFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
