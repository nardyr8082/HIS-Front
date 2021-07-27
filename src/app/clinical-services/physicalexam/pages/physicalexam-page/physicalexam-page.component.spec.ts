import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PhysicalexamPageComponent } from './physicalexam-page.component';



describe('PhysicalexamPageComponent', () => {
  let component: PhysicalexamPageComponent;
  let fixture: ComponentFixture<PhysicalexamPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PhysicalexamPageComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PhysicalexamPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
