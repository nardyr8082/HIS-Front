import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InventoryCountPageComponent } from './inventory-count-page.component';

describe('InventoryCountPageComponent', () => {
  let component: InventoryCountPageComponent;
  let fixture: ComponentFixture<InventoryCountPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InventoryCountPageComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InventoryCountPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
