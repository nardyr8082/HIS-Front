import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InventoryStatusPageComponent } from './inventory-status-page.component';

describe('InventoryStatusPageComponent', () => {
  let component: InventoryStatusPageComponent;
  let fixture: ComponentFixture<InventoryStatusPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InventoryStatusPageComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InventoryStatusPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
