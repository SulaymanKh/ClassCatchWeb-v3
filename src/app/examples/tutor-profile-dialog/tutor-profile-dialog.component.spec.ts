import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TutorProfileDialogComponent } from './tutor-profile-dialog.component';

describe('TutorProfileDialogComponent', () => {
  let component: TutorProfileDialogComponent;
  let fixture: ComponentFixture<TutorProfileDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TutorProfileDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TutorProfileDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
