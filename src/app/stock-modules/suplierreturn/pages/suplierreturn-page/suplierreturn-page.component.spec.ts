import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SuplierreturnPageComponent } from './suplierreturn-page.component';



describe('SuplierreturnPageComponent', () => {
  let component: SuplierreturnPageComponent;
  let fixture: ComponentFixture<SuplierreturnPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SuplierreturnPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SuplierreturnPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
