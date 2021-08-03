import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoteDistributionManageModalComponent } from './lote-distribution-manage-modal.component';

describe('LoteDistributionManageModalComponent', () => {
  let component: LoteDistributionManageModalComponent;
  let fixture: ComponentFixture<LoteDistributionManageModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoteDistributionManageModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoteDistributionManageModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
