import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommercialOperationFormComponent } from './commercial-operation-form.component';

describe('MunicipalityFormComponent', () => {
  let component: CommercialOperationFormComponent;
  let fixture: ComponentFixture<CommercialOperationFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CommercialOperationFormComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CommercialOperationFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
