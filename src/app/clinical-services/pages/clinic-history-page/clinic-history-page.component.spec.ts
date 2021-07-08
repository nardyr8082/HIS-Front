import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClinicHistoryPageComponent } from './clinic-history-page.component';

describe('ClinicHistoryPageComponent', () => {
  let component: ClinicHistoryPageComponent;
  let fixture: ComponentFixture<ClinicHistoryPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClinicHistoryPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ClinicHistoryPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
