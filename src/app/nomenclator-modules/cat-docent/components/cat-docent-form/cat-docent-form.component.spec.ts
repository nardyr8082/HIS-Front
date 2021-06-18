import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CatDocentFormComponent } from './cat-docent-form.component';

describe('CatDocentFormComponent', () => {
  let component: CatDocentFormComponent;
  let fixture: ComponentFixture<CatDocentFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CatDocentFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CatDocentFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
