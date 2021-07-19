import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WarehouseInventoryDifferenceFormComponent } from './warehouse-inventory-difference-form.component';

describe('WarehouseInventoryDifferenceFormComponent', () => {
  let component: WarehouseInventoryDifferenceFormComponent;
  let fixture: ComponentFixture<WarehouseInventoryDifferenceFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WarehouseInventoryDifferenceFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WarehouseInventoryDifferenceFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
