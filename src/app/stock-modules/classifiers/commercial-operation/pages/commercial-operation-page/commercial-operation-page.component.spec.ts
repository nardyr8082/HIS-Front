import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommercialOperationPageComponent } from './commercial-operation-page.component';

describe('CommercialOperationPageComponent', () => {
  let component: CommercialOperationPageComponent;
  let fixture: ComponentFixture<CommercialOperationPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CommercialOperationPageComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CommercialOperationPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
