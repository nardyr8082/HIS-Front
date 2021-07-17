import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SystemmanagerPageComponent } from './systemmanager-page.component';



describe('SystemmanagerPageComponent', () => {
  let component: SystemmanagerPageComponent;
  let fixture: ComponentFixture<SystemmanagerPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SystemmanagerPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SystemmanagerPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
