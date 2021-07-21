import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubprogramaPageComponent } from './subprograma-page.component';

describe('SubprogramaPageComponent', () => {
  let component: SubprogramaPageComponent;
  let fixture: ComponentFixture<SubprogramaPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SubprogramaPageComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SubprogramaPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
