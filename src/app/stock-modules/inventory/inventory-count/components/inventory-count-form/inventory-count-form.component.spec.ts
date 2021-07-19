import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InventoryCountFormComponent } from './inventory-count-form.component';

describe('InventoryCountFormComponent', () => {
  let component: InventoryCountFormComponent;
  let fixture: ComponentFixture<InventoryCountFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InventoryCountFormComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InventoryCountFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
