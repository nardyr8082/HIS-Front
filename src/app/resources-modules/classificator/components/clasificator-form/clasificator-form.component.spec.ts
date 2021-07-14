import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClasificatorFormComponent } from './clasificator-form.component';

describe('ClasificatorFormComponent', () => {
  let component: ClasificatorFormComponent;
  let fixture: ComponentFixture<ClasificatorFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClasificatorFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ClasificatorFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
