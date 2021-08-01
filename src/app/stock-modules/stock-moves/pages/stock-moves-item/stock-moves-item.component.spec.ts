import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StockMovesItemComponent } from './stock-moves-item.component';

describe('StockMovesItemComponent', () => {
  let component: StockMovesItemComponent;
  let fixture: ComponentFixture<StockMovesItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StockMovesItemComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StockMovesItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
