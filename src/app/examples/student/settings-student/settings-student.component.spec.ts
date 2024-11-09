import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingsStudentComponent } from './settings-student.component';

describe('SettingsStudentComponent', () => {
  let component: SettingsStudentComponent;
  let fixture: ComponentFixture<SettingsStudentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SettingsStudentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SettingsStudentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
