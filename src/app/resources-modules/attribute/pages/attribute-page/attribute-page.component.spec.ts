import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AttributePageComponent } from './attribute-page.component';

describe('AttributePageComponent', () => {
  let component: AttributePageComponent;
  let fixture: ComponentFixture<AttributePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AttributePageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AttributePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
