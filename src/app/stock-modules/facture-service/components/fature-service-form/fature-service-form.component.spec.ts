import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FactureServiceFormComponent } from './fature-service-form.component';

describe('FatureServiceFormComponent', () => {
  let component: FactureServiceFormComponent;
  let fixture: ComponentFixture<FactureServiceFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FactureServiceFormComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FactureServiceFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
