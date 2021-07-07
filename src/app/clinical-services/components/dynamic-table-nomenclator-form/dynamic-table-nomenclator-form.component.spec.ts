import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DynamicTableNomenclatorFormComponent } from './dynamic-table-nomenclator-form.component';

describe('DynamicTableNomenclatorFormComponent', () => {
  let component: DynamicTableNomenclatorFormComponent;
  let fixture: ComponentFixture<DynamicTableNomenclatorFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DynamicTableNomenclatorFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DynamicTableNomenclatorFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
