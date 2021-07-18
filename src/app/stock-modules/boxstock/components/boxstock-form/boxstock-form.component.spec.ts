import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BoxstockFormComponent } from './boxstock-form.component';


describe('BoxstockFormComponent', () => {
  let component: BoxstockFormComponent;
  let fixture: ComponentFixture<BoxstockFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BoxstockFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BoxstockFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
