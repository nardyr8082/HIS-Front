import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlmacencajaFormComponent } from './almacencaja-form.component';

describe('AlmacencajaFormComponent', () => {
  let component: AlmacencajaFormComponent;
  let fixture: ComponentFixture<AlmacencajaFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AlmacencajaFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AlmacencajaFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
