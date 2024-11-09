import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router } from '@angular/router';
import { AuthService } from 'app/services/auth-service/auth.service';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss']
})
export class SigninComponent implements OnInit {
  signInForm: FormGroup;
  responseMessage: string | null = null;
  responseType: 'success' | 'error' | null = null;
  loading = false;
  focus;
  focus1;

  constructor(
    private fb: FormBuilder,
    private spinner: NgxSpinnerService,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.signInForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.signInForm.invalid) {
      this.signInForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.spinner.show();

    const { username, password } = this.signInForm.value;

    this.authService.login(username, password).subscribe({
      next: (success) => {
        this.loading = false;
        this.spinner.hide();
        if (success) {
          this.router.navigate(['/user-profile']);
        } else {
          this.responseMessage = 'Login failed. Please check your credentials.';
          this.responseType = 'error';
        }
      },
      error: (error) => {
        this.loading = false;
        this.spinner.hide();
        this.responseMessage = 'An error occurred. Please try again later.';
        this.responseType = 'error';
        console.error('Login error:', error);
      }
    });
  }
}
