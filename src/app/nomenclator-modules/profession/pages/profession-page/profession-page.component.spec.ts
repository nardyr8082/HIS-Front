import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfessionPageComponent } from './profession-page.component';

describe('CountryPageComponent', () => {
  let component: ProfessionPageComponent;
  let fixture: ComponentFixture<ProfessionPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProfessionPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfessionPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
