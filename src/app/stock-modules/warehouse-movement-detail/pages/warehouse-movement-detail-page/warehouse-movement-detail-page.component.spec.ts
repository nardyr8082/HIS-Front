import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WarehouseMovementDetailPageComponent } from './warehouse-movement-detail-page.component';

describe('WarehouseMovementDetailPageComponent', () => {
  let component: WarehouseMovementDetailPageComponent;
  let fixture: ComponentFixture<WarehouseMovementDetailPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WarehouseMovementDetailPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WarehouseMovementDetailPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
