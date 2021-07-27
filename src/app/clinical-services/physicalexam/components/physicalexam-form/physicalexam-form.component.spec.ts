import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PhysicalexamFormComponent } from './physicalexam-form.component';





describe('PhysicalexamFormComponent', () => {
  let component: PhysicalexamFormComponent;
  let fixture: ComponentFixture<PhysicalexamFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PhysicalexamFormComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PhysicalexamFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
