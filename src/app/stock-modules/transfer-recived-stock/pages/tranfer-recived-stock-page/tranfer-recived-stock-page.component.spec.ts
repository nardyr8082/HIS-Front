import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TranferRecivedStockPageComponent } from './tranfer-recived-stock-page.component';

describe('TranferRecivedStockPageComponent', () => {
  let component: TranferRecivedStockPageComponent;
  let fixture: ComponentFixture<TranferRecivedStockPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TranferRecivedStockPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TranferRecivedStockPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
