import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenderPageComponent } from './gender-page.component';

describe('MunicipalityPageComponent', () => {
  let component: GenderPageComponent;
  let fixture: ComponentFixture<GenderPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GenderPageComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GenderPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
