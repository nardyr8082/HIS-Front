import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WarehouseMovementDetailFormComponent } from './warehouse-movement-detail-form.component';

describe('WarehouseMovementDetailFormComponent', () => {
  let component: WarehouseMovementDetailFormComponent;
  let fixture: ComponentFixture<WarehouseMovementDetailFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WarehouseMovementDetailFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WarehouseMovementDetailFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
