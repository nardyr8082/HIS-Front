import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ServicesstockFormComponent } from './servicesstock-form.component';

describe('ServicesstockFormComponent', () => {
  let component: ServicesstockFormComponent;
  let fixture: ComponentFixture<ServicesstockFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ServicesstockFormComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ServicesstockFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
