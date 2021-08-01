import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StockMovesFormComponent } from './stock-moves-form.component';

describe('StockMovesFormComponent', () => {
  let component: StockMovesFormComponent;
  let fixture: ComponentFixture<StockMovesFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StockMovesFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StockMovesFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
