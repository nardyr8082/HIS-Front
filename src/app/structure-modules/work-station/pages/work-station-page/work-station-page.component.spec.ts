import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkStationPageComponent } from './work-station-page.component';

describe('WorkStationPageComponent', () => {
  let component: WorkStationPageComponent;
  let fixture: ComponentFixture<WorkStationPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WorkStationPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkStationPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
