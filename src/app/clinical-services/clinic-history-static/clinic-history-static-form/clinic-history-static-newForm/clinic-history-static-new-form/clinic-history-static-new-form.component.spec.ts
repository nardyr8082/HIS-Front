import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClinicHistoryStaticNewFormComponent } from './clinic-history-static-new-form.component';

describe('ClinicHistoryStaticNewFormComponent', () => {
  let component: ClinicHistoryStaticNewFormComponent;
  let fixture: ComponentFixture<ClinicHistoryStaticNewFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClinicHistoryStaticNewFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ClinicHistoryStaticNewFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
