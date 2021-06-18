import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpecialtyPageComponent } from './specialty-page.component';

describe('SpecialtyPageComponent', () => {
  let component: SpecialtyPageComponent;
  let fixture: ComponentFixture<SpecialtyPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SpecialtyPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SpecialtyPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
