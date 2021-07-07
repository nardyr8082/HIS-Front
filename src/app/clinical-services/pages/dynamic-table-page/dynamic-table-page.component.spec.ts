import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DynamicTablePageComponent } from './dynamic-table-page.component';

describe('DynamicTablePageComponent', () => {
  let component: DynamicTablePageComponent;
  let fixture: ComponentFixture<DynamicTablePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DynamicTablePageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DynamicTablePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
