import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExistencePageComponent } from './existence-page.component';

describe('ExistencePageComponent', () => {
  let component: ExistencePageComponent;
  let fixture: ComponentFixture<ExistencePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExistencePageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExistencePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
