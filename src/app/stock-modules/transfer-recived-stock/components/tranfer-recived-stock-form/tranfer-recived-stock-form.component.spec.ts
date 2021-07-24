import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TranferRecivedStockFormComponent } from './tranfer-recived-stock-form.component';

describe('TranferRecivedStockFormComponent', () => {
  let component: TranferRecivedStockFormComponent;
  let fixture: ComponentFixture<TranferRecivedStockFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TranferRecivedStockFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TranferRecivedStockFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
