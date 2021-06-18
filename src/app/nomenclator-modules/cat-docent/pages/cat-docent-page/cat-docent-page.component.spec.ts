import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CatDocentPageComponent } from './cat-docent-page.component';

describe('CatDocentPageComponent', () => {
  let component: CatDocentPageComponent;
  let fixture: ComponentFixture<CatDocentPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CatDocentPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CatDocentPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
