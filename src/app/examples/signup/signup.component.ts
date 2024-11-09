import { Component, OnInit, ChangeDetectorRef  } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmationSignup } from 'app/examples/popUps/confirmationSignup.component';
import { NgToastService } from 'ng-angular-popup';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {
  focus;
  focus1;
  registrationForm: FormGroup;
  responseMessage: string | null = null;
  responseType: 'success' | 'error' | null = null;
  loading = false;
  isStudent: boolean;
  isTutor: boolean;

  constructor(
    private formBuilder: FormBuilder,
    private spinner: NgxSpinnerService,
    private modalService: NgbModal,
    private router: Router,
    private route: ActivatedRoute,
    private toast : NgToastService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.isStudent = params.userType === 'student';
      this.isTutor = params.userType === 'tutor';
    });
    this.spinner.show();
    this.initForm();
  }

  initForm() {
    this.registrationForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      username: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(25)]],
      password: ['', [Validators.required, Validators.minLength(8), Validators.pattern(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{8,}$/)]],
      confirmPassword: ['', Validators.required]
    });
  }

  // Convenience getter for easy access to form fields
  get f() { return this.registrationForm.controls; }

  register() {
    // Stop here if form is invalid
    if (this.registrationForm.invalid) {
      return;
    }

    this.popUp();
    this.loading = true;
    this.spinner.show();
  }

  toggleAccountType() {
    this.isStudent = !this.isStudent;
    this.cdr.detectChanges();
  }

  popUp() {
    const modalRef = this.modalService.open(ConfirmationSignup);
    modalRef.componentInstance.name = 'ConfirmationSignup';
    modalRef.componentInstance.isTutor = !this.isStudent;
    modalRef.componentInstance.cancelEvent.subscribe(() => this.onCancel());
    modalRef.componentInstance.confirmEvent.subscribe(() => this.onConfirm());
  }

  onCancel() {
    const modalRef = this.modalService.dismissAll(ConfirmationSignup);
    this.loading = false;
    this.spinner.hide();
  }

  onConfirm() {
    this.registerUser();
  }

  registerUser() {
    const modalRef = this.modalService.dismissAll(ConfirmationSignup);
    const { email, username, password, confirmPassword } = this.registrationForm.value;

    let role = this.isStudent ? 1 : 0;

    fetch("https://localhost:5002/api/ClassCatch/Account/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        username,
        password,
        confirmPassword,
        role,
      })
    })
    .then((response) => {
      this.loading = false;
      this.spinner.hide();

      return response.json();
    })
    .then((data) => {
      this.responseMessage = data.information;
      if (!data.isError) { 
        if (this.responseMessage === "User registered successfully."){
          this.router.navigate(['/signin']);
          this.responseType = "success"
          this.openSuccess("Welcome aboard!", "Start exploring with your new account");
        }
      }else{
        this.responseType = "error"
      }

    })
    .catch((error) => {
      this.loading = false;
      this.spinner.hide();
      console.error(error);
    });
  }

  openSuccess(message, title){
    this.toast.success(message,title, 5000);
  }
}
