import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClinicHistoryItemComponent } from './clinic-history-item.component';

describe('ClinicHistoryItemComponent', () => {
  let component: ClinicHistoryItemComponent;
  let fixture: ComponentFixture<ClinicHistoryItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClinicHistoryItemComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ClinicHistoryItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
