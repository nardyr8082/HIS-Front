import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FactureServicePageComponent } from './fature-service-page.component';

describe('FatureServicePageComponent', () => {
  let component: FactureServicePageComponent;
  let fixture: ComponentFixture<FactureServicePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FactureServicePageComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FactureServicePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
