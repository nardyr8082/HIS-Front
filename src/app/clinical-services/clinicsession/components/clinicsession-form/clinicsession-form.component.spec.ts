import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ClinicsessionFormComponent } from './clinicsession-form.component';




describe('ClinicsessionFormComponent', () => {
  let component: ClinicsessionFormComponent;
  let fixture: ComponentFixture<ClinicsessionFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ClinicsessionFormComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ClinicsessionFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
