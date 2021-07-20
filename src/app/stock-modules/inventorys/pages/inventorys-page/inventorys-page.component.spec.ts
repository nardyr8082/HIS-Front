import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InventorysPageComponent } from './inventorys-page.component';

describe('InventorysPageComponent', () => {
  let component: InventorysPageComponent;
  let fixture: ComponentFixture<InventorysPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InventorysPageComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InventorysPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
