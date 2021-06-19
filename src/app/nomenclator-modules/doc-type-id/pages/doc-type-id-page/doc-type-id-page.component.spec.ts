import { ComponentFixture, TestBed } from '@angular/core/testing';

import {DocTypeIdPageComponent } from './doc-type-id-page.component';

describe('DocTypeIdPageComponent', () => {
  let component: DocTypeIdPageComponent;
  let fixture: ComponentFixture<DocTypeIdPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DocTypeIdPageComponent ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DocTypeIdPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
