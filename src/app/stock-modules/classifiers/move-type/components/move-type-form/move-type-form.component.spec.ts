import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MoveTypeFormComponent } from './move-type-form.component';

describe('MoveTypeFormComponent', () => {
  let component: MoveTypeFormComponent;
  let fixture: ComponentFixture<MoveTypeFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MoveTypeFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MoveTypeFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
