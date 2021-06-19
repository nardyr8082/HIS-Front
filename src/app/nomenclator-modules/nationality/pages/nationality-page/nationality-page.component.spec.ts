import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NationalityPageComponent } from './nationality-page.component';

describe('MunicipalityPageComponent', () => {
  let component: NationalityPageComponent;
  let fixture: ComponentFixture<NationalityPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NationalityPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NationalityPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
