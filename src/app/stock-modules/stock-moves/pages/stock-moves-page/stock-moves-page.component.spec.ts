import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StockMovesPageComponent } from './stock-moves-page.component';

describe('StockMovesPageComponent', () => {
  let component: StockMovesPageComponent;
  let fixture: ComponentFixture<StockMovesPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StockMovesPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StockMovesPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
