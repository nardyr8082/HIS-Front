import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfessionFormComponent } from './profession-form.component';

describe('CountryFormComponent', () => {
  let component: ProfessionFormComponent;
  let fixture: ComponentFixture<ProfessionFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProfessionFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfessionFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
