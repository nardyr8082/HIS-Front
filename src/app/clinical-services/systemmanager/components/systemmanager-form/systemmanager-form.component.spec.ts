import { ComponentFixture, TestBed } from '@angular/core/testing';



describe('SystemmanagerFormComponent', () => {
  let component: SystemmanagerFormComponent;
  let fixture: ComponentFixture<SystemmanagerFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SystemmanagerFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SystemmanagerFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
