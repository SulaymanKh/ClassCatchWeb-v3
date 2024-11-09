import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterModule } from '@angular/router';
import { NgxSpinnerModule } from 'ngx-spinner';
import { provideHttpClient } from '@angular/common/http';

import { LandingComponent } from './landing/landing.component';
import { ProfileComponent } from './student/profile/profile.component';
import { SignupComponent } from './signup/signup.component';
import { SigninComponent } from './signin/signin.component';
import { ConfirmationSignup } from './popUps/confirmationSignup.component';
import { CalenderComponent } from './student/calender/calender.component';
import { NotificationComponent } from 'app/examples/notification/notification.component';
import { TutorProfileDialogComponent } from './tutor-profile-dialog/tutor-profile-dialog.component';
import { TutorFilterPipe } from './tutor-filter-pipe/tutor-filter.pipe';
import { BookingTutorComponent } from './student/booking-tutor/booking-tutor.component';
import { PaymentCardComponent } from './payment-card/payment-card.component';
import { AddPaymentMethodDialogComponent } from './student/add-payment-method-dialog/add-payment-method-dialog.component';

import { SettingsStudentComponent } from './student/settings-student/settings-student.component';

import { MatStepperModule } from '@angular/material/stepper';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { FullCalendarModule } from '@fullcalendar/angular';

import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { StepsModule } from 'primeng/steps';
import { ButtonModule } from 'primeng/button';
import { RadioButtonModule } from 'primeng/radiobutton';
import { CardModule } from 'primeng/card';
import { ToastModule } from 'primeng/toast';

// import { StripeModule } from "stripe-angular"

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    NgxSpinnerModule,
    RouterModule,
    FullCalendarModule,
    MatStepperModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDialogModule,
    MatSelectModule,
    MatIconModule,
    CalendarModule,
    DropdownModule,
    InputTextModule,
    InputTextareaModule,
    StepsModule,
    ButtonModule,
    RadioButtonModule,
    CardModule,
    ToastModule,
    // StripeModule.forRoot("...YOUR-STRIPE-KEY-HERE...") 
  ],
  declarations: [
    LandingComponent,
    SignupComponent,
    SigninComponent,
    ProfileComponent,
    ConfirmationSignup,
    CalenderComponent,
    NotificationComponent,
    TutorProfileDialogComponent,
    TutorFilterPipe,
    BookingTutorComponent,
    PaymentCardComponent,
    SettingsStudentComponent,
    AddPaymentMethodDialogComponent
  ],
  providers: [
    provideHttpClient()
  ]
})
export class ExamplesModule { }
