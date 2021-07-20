import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InventorysFormComponent } from './inventorys-form.component';



describe('InventorysFormComponent', () => {
  let component: InventorysFormComponent;
  let fixture: ComponentFixture<InventorysFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InventorysFormComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InventorysFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
