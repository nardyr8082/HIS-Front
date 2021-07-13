import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MoveStatusPageComponent } from './move-status-page.component';

describe('InventoryStatePageComponent', () => {
  let component: MoveStatusPageComponent;
  let fixture: ComponentFixture<MoveStatusPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MoveStatusPageComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MoveStatusPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
