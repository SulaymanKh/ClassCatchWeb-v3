import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookingTutorComponent } from './booking-tutor.component';

describe('BookingTutorComponent', () => {
  let component: BookingTutorComponent;
  let fixture: ComponentFixture<BookingTutorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BookingTutorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BookingTutorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
