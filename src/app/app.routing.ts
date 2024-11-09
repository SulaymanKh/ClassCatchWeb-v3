import { NgModule } from '@angular/core';
import { CommonModule, } from '@angular/common';
import { BrowserModule  } from '@angular/platform-browser';
import { Routes, RouterModule } from '@angular/router';

//Any User User Imports
import { SignupComponent } from './examples/signup/signup.component';
import { SigninComponent } from './examples/signin/signin.component';
import { LandingComponent } from './examples/landing/landing.component';

// Student User Imports
import { ProfileComponent } from './examples/student/profile/profile.component';
import { CalenderComponent } from './examples/student/calender/calender.component';
import { BookingTutorComponent } from './examples/student/booking-tutor/booking-tutor.component';
import { SettingsStudentComponent } from './examples/student/settings-student/settings-student.component';

// Extras
import { LoggedInGuard } from './components/logged-in-guard/logged-in.guard'; 
import { RoleGuard } from './guards/role/role.guard';

const routes: Routes =[
    { path: '', redirectTo: 'home', pathMatch: 'prefix' },
    { path: 'home',             component: LandingComponent },
    { path: 'signup',           component: SignupComponent },
    { path: 'signin',           component: SigninComponent },
    { path: 'landing',          component: LandingComponent },
    { path: 'user-profile',     component: ProfileComponent, canActivate: [RoleGuard], data: { expectedRole: 'Student' } },
    { path: 'calender',         component: CalenderComponent, canActivate: [RoleGuard], data: { expectedRole: 'Student' } },
    { path: 'booking-tutor',    component: BookingTutorComponent, canActivate: [RoleGuard], data: { expectedRole: 'Student' }  },
    { path: 'student-settings',    component: SettingsStudentComponent, canActivate: [RoleGuard], data: { expectedRole: 'Student' }  },
    { path: '**', redirectTo: '/home' }
];

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    RouterModule.forRoot(routes,{
      useHash: false
    })
  ],
  exports: [
  ],
})
export class AppRoutingModule { }
