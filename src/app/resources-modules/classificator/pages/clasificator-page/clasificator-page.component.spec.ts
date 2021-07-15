import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClasificatorPageComponent } from './clasificator-page.component';

describe('ClasificatorPageComponent', () => {
  let component: ClasificatorPageComponent;
  let fixture: ComponentFixture<ClasificatorPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClasificatorPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ClasificatorPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
