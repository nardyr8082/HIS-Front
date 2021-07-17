import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BoxstockPageComponent } from './boxstock-page.component';


describe('BoxstockPageComponent', () => {
  let component: BoxstockPageComponent;
  let fixture: ComponentFixture<BoxstockPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BoxstockPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BoxstockPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
