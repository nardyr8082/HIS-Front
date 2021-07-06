import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DynamicTableItemPageComponent } from './dynamic-table-item-page.component';

describe('DynamicTableItemPageComponent', () => {
  let component: DynamicTableItemPageComponent;
  let fixture: ComponentFixture<DynamicTableItemPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DynamicTableItemPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DynamicTableItemPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
