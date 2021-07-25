import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WarehouseLotPageComponent } from './warehouse-lot-page.component';

describe('WarehouseLotPageComponent', () => {
  let component: WarehouseLotPageComponent;
  let fixture: ComponentFixture<WarehouseLotPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WarehouseLotPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WarehouseLotPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
