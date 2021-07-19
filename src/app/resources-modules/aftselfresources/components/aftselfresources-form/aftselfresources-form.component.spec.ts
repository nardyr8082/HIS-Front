import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AftselfresourcesFormComponent } from './aftselfresources-form.component';

describe('AftselfresourcesFormComponent', () => {
  let component: AftselfresourcesFormComponent;
  let fixture: ComponentFixture<AftselfresourcesFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AftselfresourcesFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AftselfresourcesFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
