import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AftselfresourcesPageComponent } from './aftselfresources-page.component';

describe('AftselfresourcesPageComponent', () => {
  let component: AftselfresourcesPageComponent;
  let fixture: ComponentFixture<AftselfresourcesPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AftselfresourcesPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AftselfresourcesPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
