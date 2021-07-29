import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClinicHistoryStaticPageComponent } from './clinic-history-static-page.component';

describe('ClinicHistoryStaticPageComponent', () => {
  let component: ClinicHistoryStaticPageComponent;
  let fixture: ComponentFixture<ClinicHistoryStaticPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClinicHistoryStaticPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ClinicHistoryStaticPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
