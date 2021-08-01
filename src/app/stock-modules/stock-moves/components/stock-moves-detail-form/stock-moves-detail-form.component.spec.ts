import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StockMovesDetailFormComponent } from './stock-moves-detail-form.component';

describe('StockMovesDetailFormComponent', () => {
  let component: StockMovesDetailFormComponent;
  let fixture: ComponentFixture<StockMovesDetailFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StockMovesDetailFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StockMovesDetailFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
