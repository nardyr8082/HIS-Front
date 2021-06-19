import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CivilStatusPageComponent } from './civil-status-page.component';

describe('CivilStatusPageComponent', () => {
  let component: CivilStatusPageComponent;
  let fixture: ComponentFixture<CivilStatusPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CivilStatusPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CivilStatusPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
