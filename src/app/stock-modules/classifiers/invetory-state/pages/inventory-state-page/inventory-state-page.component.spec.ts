import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InventoryStatePageComponent } from './inventory-state-page.component';

describe('InventoryStatePageComponent', () => {
  let component: InventoryStatePageComponent;
  let fixture: ComponentFixture<InventoryStatePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InventoryStatePageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InventoryStatePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
