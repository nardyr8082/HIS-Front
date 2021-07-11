import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InventoryStateFormComponent } from './inventory-state-form.component';

describe('InventoryStateFormComponent', () => {
  let component: InventoryStateFormComponent;
  let fixture: ComponentFixture<InventoryStateFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InventoryStateFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InventoryStateFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
