import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WarehouseInventoryDifferencePageComponent } from './warehouse-inventory-difference-page.component';

describe('WarehouseInventoryDifferencePageComponent', () => {
  let component: WarehouseInventoryDifferencePageComponent;
  let fixture: ComponentFixture<WarehouseInventoryDifferencePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WarehouseInventoryDifferencePageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WarehouseInventoryDifferencePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
