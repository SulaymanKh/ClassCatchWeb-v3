import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { NgToastService } from 'ng-angular-popup';
import { NgbNav } from '@ng-bootstrap/ng-bootstrap';
import { FullCalendarComponent } from '@fullcalendar/angular';
import { MatDialog } from '@angular/material/dialog';
import { TutorProfileDialogComponent } from '../../tutor-profile-dialog/tutor-profile-dialog.component';
import { AuthService } from 'app/services/auth-service/auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  @ViewChild('calendar') calendarComponent: FullCalendarComponent;
  @ViewChild('nav') nav: NgbNav;
  tutors = [];
  filteredTutors = [];
  subjects = [];
  user: any = {};
  profileForm: FormGroup;
  loading = false;
  viewMode: 'large' | 'mini' = 'large';

  constructor(
    private router: Router,
    private spinner: NgxSpinnerService,
    private toast: NgToastService,
    public dialog: MatDialog,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.profileForm = new FormGroup({
      firstname: new FormControl('', Validators.required),
      lastname: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.required, Validators.email]),
      isAvailable: new FormControl(true),
      profilePicture: new FormControl(null),
      oldPassword: new FormControl(''),
      newPassword: new FormControl(''),
      confirmPassword: new FormControl('')
    });

    this.fetchUserInformation();
    this.fetchTutors();
  }

  fetchUserInformation(): void {
    this.spinner.show();
    this.loading = true;

    this.authService.fetchUserInfo().subscribe({
      next: (user) => {
        this.loading = false;
        this.spinner.hide();
        if (user) {
          this.user = user.data;
          this.setFormValues(this.user);
        } else {
          console.warn('Empty response received');
        }
      },
      error: (error) => {
        this.loading = false;
        this.spinner.hide();
        console.error('Error fetching user information:', error);
      },
      complete: () => {
        this.loading = false;
      }
    });
  }

  setFormValues(user): void {
    this.profileForm.patchValue({
      firstname: user.firstName || '',
      lastname: user.lastName || '',
      email: user.email || '',
      profilePicture: user.profilePicture || '',
    });
  }

  fetchTutors(): void {
    this.tutors = [
      { id: 1, name: 'Mrs Khan', photoUrl: './assets/img/faces/clem-onojeghuo-2.jpg', role: 'Maths Tutor',  subject: 'Math', rating: 4.5, experience: 5 },
      { id: 2, name: 'Mrs Ajmal', photoUrl: './assets/img/faces/clem-onojeghuo-2.jpg', role: 'English Tutor',  subject: 'English', rating: 4.0, experience: 3 },
      { id: 3, name: 'Mr Sheikh', photoUrl: './assets/img/faces/ayo-ogunseinde-2.jpg', role: 'Junior Maths Tutor', subject: 'Math', rating: 3.8, experience: 1 },
      { id: 4, name: 'Mr Connor', photoUrl: './assets/img/faces/ayo-ogunseinde-2.jpg', role: 'Junior English Tutor', subject: 'English', rating: 3.8, experience: 1 },
      { id: 5, name: 'Mr Hamza', photoUrl: './assets/img/faces/ayo-ogunseinde-2.jpg', role: 'Junior English Tutor', subject: 'English', rating: 3.8, experience: 1 },
      { id: 6, name: 'Mr Riffat', photoUrl: './assets/img/faces/ayo-ogunseinde-2.jpg', role: 'Senior Food Tutor', subject: 'Food Tech', rating: 3.8, experience: 1 },
      { id: 7, name: 'Mr Yunus', photoUrl: './assets/img/faces/ayo-ogunseinde-2.jpg', role: 'Junior IT Tutor', subject: 'IT', rating: 3.8, experience: 1 },
    ];
    this.filteredTutors = this.tutors;
    this.subjects = [...new Set(this.tutors.map(tutor => tutor.subject))]; // Extract unique subjects
  }

  searchTutors(searchTerm: string, selectedSubject: string): void {
    this.filteredTutors = this.tutors.filter(tutor =>
      tutor.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (selectedSubject === '' || tutor.subject === selectedSubject)
    );
  }

  selectTutor(tutor): void {
    const dialogRef = this.dialog.open(TutorProfileDialogComponent, {
      width: '400px',
      data: tutor
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result?.book) {
        this.router.navigate(['/calender'], { queryParams: { tutorId: result.tutor.id, tutorName: result.tutor.name } });
      }
    });
  }

  onProfilePictureChange(event): void {
    const file = event.target.files[0];
    this.profileForm.patchValue({ profilePicture: file });
  }

  updateDetails(): void {
    this.spinner.show();
    this.loading = true;

    if (this.profileForm.valid) {
      const formData = new FormData();
      const currentFormValue = this.profileForm.value;
      if (currentFormValue.firstname !== this.user.firstName) {
        formData.append('FirstName', currentFormValue.firstname);
      }
      if (currentFormValue.lastname !== this.user.lastName) {
        formData.append('LastName', currentFormValue.lastname);
      }
      if (currentFormValue.email !== this.user.email) {
        formData.append('Email', currentFormValue.email);
      }
      const profilePicture = this.profileForm.get('profilePicture').value;
      if (profilePicture) {
        formData.append('ProfilePicture', profilePicture, profilePicture.name);
      }

      const headers = new Headers({
        'Authorization': `Bearer ${this.getToken()}`
      });

      const requestOptions = {
        method: "PUT",
        headers: headers,
        body: formData,
      };

      fetch("https://localhost:5002/api/ClassCatch/Account/userinfo/update-profile", requestOptions)
      .then((response) => {
        this.loading = false;
        this.spinner.hide();
        return response.json();
       
      })
      .then((data) => {
        if (!data.isError) { 
          this.fetchUserInformation(); 

          this.openSuccess("Profile Changes Saved", "Your updates have been applied");
        }
        else{
          this.openError("Oops! Something Went Wrong", "We couldn't update your profile at this time.");
        }
      })
      .catch((error) => {
        console.error('Error updating profile', error);

        this.openError("Oops! Something Went Wrong", "We couldn't update your profile at this time.");
      });
    }
  }

  getProfilePictureUrl(profilePicture: string): string {
    if (!profilePicture) {
      return './assets/img/faces/avatar.svg';
    }
    const apiUrl = 'https://localhost:5002/';
    return `${apiUrl}${profilePicture}`;
  }

  goToBookATutor() {
    this.nav.select(2);
  }

  openSuccess(message, title){
    this.toast.success(message,title, 5000);
  }

  openError(message, title){
    this.toast.danger(message,title, 5000);
  }

  toggleView(): void {
    this.viewMode = this.viewMode === 'large' ? 'mini' : 'large';
  }

  private getToken(): string {
    return this.authService.getCurrentUser()?.token;
  }
}
