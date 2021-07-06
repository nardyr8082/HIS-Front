import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DynamicTableNomenclatorPageComponent } from './dynamic-table-nomenclator-page.component';

describe('DynamicTableNomenclatorPageComponent', () => {
  let component: DynamicTableNomenclatorPageComponent;
  let fixture: ComponentFixture<DynamicTableNomenclatorPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DynamicTableNomenclatorPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DynamicTableNomenclatorPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
