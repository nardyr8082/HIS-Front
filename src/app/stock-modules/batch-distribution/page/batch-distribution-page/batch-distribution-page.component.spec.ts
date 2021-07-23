import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BatchDistributionPageComponent } from './batch-distribution-page.component';

describe('BatchDistributionPageComponent', () => {
  let component: BatchDistributionPageComponent;
  let fixture: ComponentFixture<BatchDistributionPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BatchDistributionPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BatchDistributionPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
