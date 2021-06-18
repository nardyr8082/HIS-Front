import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CatSciencePageComponent } from './cat-science-page.component';

describe('CatSciencePageComponent', () => {
  let component: CatSciencePageComponent;
  let fixture: ComponentFixture<CatSciencePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CatSciencePageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CatSciencePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
