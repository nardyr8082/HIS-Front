import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WarehouseLotFormComponent } from './warehouse-lot-form.component';

describe('WarehouseLotFormComponent', () => {
  let component: WarehouseLotFormComponent;
  let fixture: ComponentFixture<WarehouseLotFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WarehouseLotFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WarehouseLotFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
