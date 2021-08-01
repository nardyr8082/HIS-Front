import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ClinicsessionPageComponent } from './clinicsession-page.component';


describe('ClinicsessionPageComponent', () => {
  let component: ClinicsessionPageComponent;
  let fixture: ComponentFixture<ClinicsessionPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ClinicsessionPageComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ClinicsessionPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
