import { Component, OnInit, ViewChild  } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { AuthService } from 'app/services/auth-service/auth.service';
import { NgToastService } from 'ng-angular-popup';
import { AddPaymentMethodDialogComponent } from 'app/examples/student/add-payment-method-dialog/add-payment-method-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { NotificationComponent, IAlert } from 'app/examples/notification/notification.component';

@Component({
  selector: 'app-settings-student',
  templateUrl: './settings-student.component.html',
  styleUrls: ['./settings-student.component.scss']
})
export class SettingsStudentComponent implements OnInit {
  @ViewChild(NotificationComponent) notificationComponent: NotificationComponent;
  activeTab: string = 'profile';
  profile: FormGroup;
  userProfileInformation: FormGroup;
  loading = false;
  user: any = {};
  paymentInformation: any = null;
  addNewPaymentInformation: any = null;

  account = {
    username: 'kennethvaldez'
  };

  security = {
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
    sessions: [
      { id: 1, location: 'San Francisco City 190.24.335.55', details: 'Your current session seen in United States' }
    ]
  };

  notification = {
    securityAlerts: true,
    digestSummary: true,
    smsNotifications: [
      { id: 1, name: 'Comments', enabled: true },
      { id: 2, name: 'Updates From People', enabled: false },
      { id: 3, name: 'Reminders', enabled: true },
      { id: 4, name: 'Events', enabled: true },
      { id: 5, name: 'Pages You Follow', enabled: false }
    ]
  };

  constructor(
    private spinner: NgxSpinnerService,
    private authService: AuthService,
    private toast: NgToastService,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.profile = new FormGroup({
      firstname: new FormControl('', Validators.required),
      lastname: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.required, Validators.email]),
      isAvailable: new FormControl(true),
      profilePicture: new FormControl('')
    });

    this.userProfileInformation = new FormGroup({
      bio: new FormControl('', Validators.required),
      location: new FormControl('', Validators.required),
      url: new FormControl('', Validators.required),
    });

    this.fetchUserInformation();
    this.fetchUserProfileInformation();
    this.fetchPaymentInfo();
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
          this.account.username = this.user.username;
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

  fetchUserProfileInformation(): void {
    this.spinner.show();
    this.loading = true;

    const authToken = this.authService.getToken();

    fetch("https://localhost:5002/api/ClassCatch/Account/user-profile", {
      method: "GET",
      headers: { 
        "Content-Type": "application/json",  
        'Authorization': `Bearer ${authToken}`
      },
    })
    .then(response => response.json())
    .then(data => {
      this.loading = false;
      this.spinner.hide();
      if (data && data.data) {
        this.setFormProfileInformationValues(data.data);
      } else {
        console.warn('Empty response received');
      }
    })
    .catch(error => {
      this.loading = false;
      this.spinner.hide();
      console.error('Error fetching user profile information:', error);
    });
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
      console.log(data);
      this.loading = false;
      this.spinner.hide();
      if (data && data.data) {
        this.paymentInformation = data.data;
      } else {
        this.paymentInformation = null;
        console.warn('No payment info found');
      }
    })
    .catch(error => {
      this.loading = false;
      this.spinner.hide();
      console.error('Error fetching payment information:', error);
    });
  }

  setFormValues(user): void {
    this.profile.patchValue({
      firstname: user.firstName || '',
      lastname: user.lastName || '',
      email: user.email || '',
      isAvailable: user.isAvailable,
      profilePicture: user.profilePicture
    });
  }

  setFormProfileInformationValues(userInformation): void {
    this.userProfileInformation.patchValue({
      bio: userInformation.bio || '',
      url: userInformation.url || '',
      location: userInformation.location || ''
    });
  }

  selectTab(tab: string) {
    this.activeTab = tab;
  }

  onSubmitProfile() {
    // API call to update profile
    console.log('Profile Updated:', this.profile.value);
  }

  resetProfile() {
    this.profile.reset();
  }

  onSubmitAccount() {
    // API call to update account settings
    console.log('Account Updated:', this.account);
  }

  deleteAccount() {
    // API call to delete account
    console.log('Account Deleted');
  }

  onProfilePictureChange(event): void {
    const file = event.target.files[0];
    this.profile.patchValue({ profilePicture: file });
  }

  onSubmitSecurity() {
    // API call to update security settings
    console.log('Security Updated:', this.security);
  }

  enableTwoFactor() {
    // API call to enable two-factor authentication
    console.log('Two-factor authentication enabled');
  }

  revokeSession(sessionId: number) {
    // API call to revoke session
    console.log('Session Revoked:', sessionId);
  }

  onSubmitNotification() {
    // API call to update notification settings
    console.log('Notification Updated:', this.notification);
  }


  updateUserDetails(): void {
    this.spinner.show();
    this.loading = true;

    const authToken = this.authService.getToken();

    if (this.profile.valid) {
      const formData = new FormData();
      const currentFormValue = this.profile.value;
      if (currentFormValue.firstname !== this.user.firstName) {
        formData.append('FirstName', currentFormValue.firstname);
      }
      if (currentFormValue.lastname !== this.user.lastName) {
        formData.append('LastName', currentFormValue.lastname);
      }
      if (currentFormValue.email !== this.user.email) {
        formData.append('Email', currentFormValue.email);
      }
      const profilePicture = this.profile.get('profilePicture').value;
      if (profilePicture) {
        formData.append('ProfilePicture', profilePicture, profilePicture.name);
      }

      const headers = new Headers({
        'Authorization': `Bearer ${authToken}`
      });

      const requestOptions = {
        method: "PUT",
        headers: headers,
        body: formData,
      };

      fetch("https://localhost:5002/api/ClassCatch/Account/user-information", requestOptions)
      .then((response) => {
        this.loading = false;
        this.spinner.hide();
        return response.json();
       
      })
      .then((data) => {
        console.log(data);
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

  updateUserProfileDetails(): void {
    this.spinner.show();
    this.loading = true;

    const authToken = this.authService.getToken();

    if (this.userProfileInformation.valid) {
      const userProfileData = {
        bio: this.userProfileInformation.get('bio').value,
        url: this.userProfileInformation.get('url').value,
        location: this.userProfileInformation.get('location').value,
      };

      const headers = new Headers({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      });

      const requestOptions = {
        method: "PUT",
        headers: headers,
        body: JSON.stringify(userProfileData),
      };

      fetch("https://localhost:5002/api/ClassCatch/Account/user-profile", requestOptions)
      .then((response) => {
        this.loading = false;
        this.spinner.hide();
        return response.json();
      })
      .then((data) => {
        console.log(data);
        if (!data.isError) {
          this.fetchUserProfileInformation();
          this.openSuccess("Profile Information Updated", "Your updates have been applied");
        } else {
          this.openError("Oops! Something Went Wrong", "We couldn't update your profile information at this time.");
        }
      })
      .catch((error) => {
        this.loading = false;
        this.spinner.hide();
        console.error('Error updating profile information', error);
        this.openError("Oops! Something Went Wrong", "We couldn't update your profile information at this time.");
      });
    }
  }

  addPaymentMethod() {
    const dialogRef = this.dialog.open(AddPaymentMethodDialogComponent);

    dialogRef.afterClosed().subscribe(async result => {
      if (result && result.token) {
        // Send the token to your backend to save the card
        console.log(result);
        await this.saveCard(result.token, result.name);
      }
    });
  }

  async saveCard(token: string, cardHolderName: string) {
    console.log(token);
    this.spinner.show();
    this.loading = true;
    const authToken = this.authService.getToken();

    const headers = new Headers({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${authToken}`
    });

    const requestOptions = {
      method: "POST",
      headers: headers,
      body: JSON.stringify({ Token: token, CardHolderName: cardHolderName }),
    };

    try {
      const response = await fetch("https://localhost:5002/api/ClassCatch/Booking/save-card", requestOptions);
      const data = await response.json();
      console.log(data);
      if (data && !data.isError) {
        this.fetchPaymentInfo(); // Refresh payment information after saving the card
        this.loading = false;
        this.spinner.hide();
        this.openSuccess("Card Saved", "Your payment method has been added successfully.");
      } else {
        this.loading = false;
        this.spinner.hide();
        this.openError("Oops! Something Went Wrong", "We couldn't save your card at this time.");
      }
    } catch (error) {
      this.loading = false;
      this.spinner.hide();
      console.error('Error saving card', error);
      this.openError("Oops! Something Went Wrong", "We couldn't save your card at this time.");
    }
  }

  removeCard(bankCardID: number): void {
    const confirmation = confirm('Are you sure you want to remove this card?');
    if (confirmation) {
      this.spinner.show();
      this.loading = true;

      const authToken = this.authService.getToken();

      fetch("https://localhost:5002/api/ClassCatch/Booking/remove-card", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",  
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify({ BankCardID: bankCardID })
      })
      .then(response => response.json())
      .then(data => {
        this.loading = false;
        this.spinner.hide();

        if (!data.isError) { 
          this.fetchPaymentInfo();

          this.openSuccess("Billing Changes Saved", "Bank account removed!");
        }
        else{
          this.openError("Oops! Something Went Wrong", "We couldn't remove the bank account at this time.");
        }
       
      })
      .catch(error => {
        this.loading = false;
        this.spinner.hide();
        console.error('Error fetching user profile information:', error);
      });
    }
  }

  setDefaultCard(bankCardID: number): void {
   const confirmation = confirm('Are you sure you want to set this card as default payment?');
    if (confirmation) {
      this.spinner.show();
      this.loading = true;
      
      const authToken = this.authService.getToken();

      fetch("https://localhost:5002/api/ClassCatch/Booking/card-preferences", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",  
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify({ BankCardID: bankCardID })
      })
      .then(response => response.json())
      .then(data => {
        this.loading = false;
        this.spinner.hide();

        if (!data.isError) { 
          this.fetchPaymentInfo();

          this.openSuccess("Billing Changes Saved", "Default payment changed!");
        }
        else{
          this.openError("Oops! Something Went Wrong", "We couldn't change the Default payment at this time.");
        }
       
      })
      .catch(error => {
        this.loading = false;
        this.spinner.hide();
        console.error('Error fetching user profile information:', error);
      });
    }
  }


  onSubmitBilling() {
    // API call to update billing settings
    console.log('Billing Updated');
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

  openSuccess(message, title){
    this.toast.success(message,title, 5000);
  }

  openError(message, title){
    this.toast.danger(message,title, 5000);
  }
}
