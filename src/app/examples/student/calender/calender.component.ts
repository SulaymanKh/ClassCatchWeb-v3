import { Component, OnInit, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { AuthService } from 'app/services/auth-service/auth.service';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-calender',
  templateUrl: './calender.component.html',
  styleUrls: ['./calender.component.scss'],
  animations: [
    trigger('shrinkDisappear', [
      state('normal', style({
        opacity: 1,
        transform: 'scale(1)'
      })),
      state('shrunk', style({
        opacity: 0,
        transform: 'scale(0.5)'
      })),
      transition('normal => shrunk', [
        animate('0.5s ease-in')
      ])
    ])
  ]
})
export class CalenderComponent implements OnInit, AfterViewInit {
  @ViewChild('cardNumberElement', { static: false }) cardNumberElement: ElementRef;
  @ViewChild('cardExpiryElement', { static: false }) cardExpiryElement: ElementRef;
  @ViewChild('cardCvcElement', { static: false }) cardCvcElement: ElementRef;
  @ViewChild('dateSelector', { static: false }) dateSelector: ElementRef;

  selectedTutor: any;
  dateFormGroup: FormGroup;
  lessonFormGroup: FormGroup;
  paymentFormGroup: FormGroup;
  availableTimes: string[];
  dates: any[] = [];
  selectedDate: any = null;
  selectedTime: string | null = null;
  currentMonth: string;
  isLinear = false;
  animationState = 'normal';
  confirmationVisible = false;

  paymentInformation: any[] = [];
  selectedCard: any = null;
  useNewCard: boolean = false;
  loading = false;
  bankCardID = null;
  bookingDate;
  bookingTime;

  constructor(
    private spinner: NgxSpinnerService,
    private route: ActivatedRoute,
    private _formBuilder: FormBuilder,
    private snackBar: MatSnackBar,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const tutorId = params['tutorId'];
      const tutorName = params['tutorName'];
      this.selectedTutor = { id: tutorId, name: tutorName };
    });

    this.dateFormGroup = this._formBuilder.group({
      date: ['', Validators.required]
    });
    this.lessonFormGroup = this._formBuilder.group({
      subject: ['', Validators.required],
      notes: ['']
    });
    this.paymentFormGroup = this._formBuilder.group({
      paymentDetails: ['', Validators.required],
      expiryDate: ['', Validators.required],
      cvv: ['', Validators.required]
    });

    this.initializeDates();
    this.fetchPaymentInfo();
  }

  ngAfterViewInit() {
    const dateSelector = this.dateSelector.nativeElement;
    dateSelector.addEventListener('wheel', (event: WheelEvent) => {
      event.preventDefault();
      const scrollSpeed = 5; // Adjust this value to make the scrolling faster
      dateSelector.scrollLeft -= event.deltaY * scrollSpeed; // Reverse the deltaY value
    });
  }

  initializeDates() {
    const startDate = new Date();
    this.currentMonth = startDate.toLocaleString('default', { month: 'long', year: 'numeric' });

    for (let i = 0; i < 20; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      const day = date.getDate();
      const weekday = date.toLocaleString('default', { weekday: 'short' });
      this.dates.push({ day, weekday, date });
    }

    // Auto-select today's date
    this.selectDate(this.dates[0]);
  }

  fetchPaymentInfo(): void {
    this.spinner.show();
    this.loading = true;

    const authToken = this.authService.getToken();

    fetch("https://localhost:5002/api/ClassCatch/Booking/bank-cards", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        'Authorization': `Bearer ${authToken}`
      }
    })
    .then(response => response.json())
    .then(data => {
      this.spinner.hide();
      this.loading = false;
      if (data && data.data) {
        this.paymentInformation = data.data;
        this.selectedCard = this.paymentInformation.find(card => card.isDefault) || this.paymentInformation[0];
      } else {
        this.paymentInformation = [];
        this.selectedCard = null;
        this.useNewCard = true;
        console.warn('No payment info found');
      }
    })
    .catch(error => {
      this.spinner.hide();
      this.loading = false;
      console.error('Error fetching payment information:', error);
    });
  }

  selectDate(date: any) {
    this.selectedDate = date;
    this.currentMonth = date.date.toLocaleString('default', { month: 'long', year: 'numeric' });
    this.bookingDate = date.date;

    this.availableTimes = this.getAvailableTimesForDate(date.day);
  }

  selectTime(time: string) {
    this.selectedTime = time;
    this.bookingTime = this.convertTo24HourTime(this.selectedTime);
  }

  getAvailableTimesForDate(date: number): string[] {
    const times = [
      '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM', '12:00 PM', 
      '12:30 PM', '1:00 PM', '1:30 PM', '2:00 PM', '2:30 PM',
      '3:00 PM', '3:30 PM', '4:00 PM', '4:30 PM', '5:00 PM'
    ];
    const randomTimes = [];
    const numberOfTimes = Math.floor(Math.random() * 6) + 1; 
    for (let i = 0; i < numberOfTimes; i++) {
      const randomIndex = Math.floor(Math.random() * times.length);
      randomTimes.push(times[randomIndex]);
      times.splice(randomIndex, 1); 
    }
    return randomTimes.sort(); 
  }

  async onSubmit() {
    this.spinner.show();
    this.loading = true;
    const formValue = this.lessonFormGroup.value;
    const notes = formValue.notes;
    const authToken = this.authService.getToken();

    try {
        const response = await fetch("https://localhost:5002/api/ClassCatch/Booking/payment-and-book", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                'Authorization': `Bearer ${authToken}`
            },
            body: JSON.stringify({
                bankCardID: this.bankCardID,
                amount: 2000,
                currency: 'GBP',
                TutorID: 47, //this.selectedTutor.id
                Subject: "Mathematics", 
                BookingDate: this.bookingDate, 
                BookingTime: this.bookingTime, 
                Notes: notes 
            })
        });

        const data = await response.json();

        if (data && !data.IsError) {
            console.log("Booking and payment successful:", data);
            // Handle successful booking and payment
        } else {
            console.error("Booking and payment failed:", data.information);
            // Handle failure
        }

        this.spinner.hide();
        this.loading = false;
    } catch (error) {
        this.spinner.hide();
        this.loading = false;
        console.error('Error processing payment and booking:', error);
    }
  }


  getCardLogo(brand: string): string {
    switch (brand.toLowerCase()) {
        case 'visa':
            return 'https://upload.wikimedia.org/wikipedia/commons/4/41/Visa_Logo.png';
        case 'mastercard':
            return 'https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg';
        case 'discover':
            return 'https://upload.wikimedia.org/wikipedia/commons/5/5a/Discover_Card_logo.svg';
        case 'amex':
            return 'https://upload.wikimedia.org/wikipedia/commons/3/30/American_Express_logo.svg';
        default:
            return 'https://upload.wikimedia.org/wikipedia/commons/b/b7/Credit_card_generic.png';
    }
  }

  setCard(bankCardID: number){
    this.bankCardID = bankCardID;
  }

  redirectToSettings() {
    this.router.navigate(['/student-settings']);
  }

  selectStoredCard(card: any) {
    this.selectedCard = card;
    this.useNewCard = false;
  }

  useNewCardDetails() {
    this.selectedCard = null;
    this.useNewCard = true;
  }

  convertTo24HourTime(timeString) {
    const [time, modifier] = timeString.split(' ');
    
    let [hours, minutes] = time.split(':');
    hours = parseInt(hours, 10);

    if (modifier === 'PM' && hours !== 12) {
        hours += 12;
    } else if (modifier === 'AM' && hours === 12) {
        hours = 0;
    }

    const formattedHours = hours.toString().padStart(2, '0');
    const formattedMinutes = minutes.padStart(2, '0');
    
    return `${formattedHours}:${formattedMinutes}:00`;
  }
}
