import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ServicesstockPageComponent } from './servicesstock-page.component';


describe('ServicesstockPageComponent', () => {
  let component: ServicesstockPageComponent;
  let fixture: ComponentFixture<ServicesstockPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ServicesstockPageComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ServicesstockPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
