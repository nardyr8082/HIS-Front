import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MoveTypePageComponent } from './move-type-page.component';

describe('MoveTypePageComponent', () => {
  let component: MoveTypePageComponent;
  let fixture: ComponentFixture<MoveTypePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MoveTypePageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MoveTypePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
