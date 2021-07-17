import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlmacencajaPageComponent } from './almacencaja-page.component';

describe('AlmacencajaPageComponent', () => {
  let component: AlmacencajaPageComponent;
  let fixture: ComponentFixture<AlmacencajaPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AlmacencajaPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AlmacencajaPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
