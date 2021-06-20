import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrgLevelPageComponent } from './org-level-page.component';

describe('RolPageComponent', () => {
  let component: OrgLevelPageComponent;
  let fixture: ComponentFixture<OrgLevelPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OrgLevelPageComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrgLevelPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
