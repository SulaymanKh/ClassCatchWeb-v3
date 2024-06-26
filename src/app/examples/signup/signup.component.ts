import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from "ngx-spinner";

@Component({
    selector: 'app-signup',
    templateUrl: './signup.component.html',
    styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {
    test : Date = new Date();
    focus;
    focus1;
    responseMessage: string | null = null;
    responseType: 'success' | 'error' | null = null;
    loading = false;

    constructor(private spinner: NgxSpinnerService) { }

    ngOnInit() {
        this.spinner.show();
    }

    register(email, username, password, confirmPassword) {
        this.loading = true;
        this.spinner.show();

        fetch("https://api.classcatch.co.uk/api/Auth/signup", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
                "username": username,
                "email": email,
                "password": password,
                "confirmPassword": confirmPassword
            })
        })
        .then((response) => {
            this.loading = false;  // Stop the spinner
            this.spinner.hide();

          if (response.ok) {
            this.responseType = 'success';
            return response.text();
          } else if (response.status == 400){
            this.responseType = 'error';
            return response.text();
          } else{
            this.responseType = 'error';
            throw new Error("Registration failed");
          }
        })
        .then((data) => {
          this.responseMessage = data;
        })
        .catch((error) => {
            this.loading = false;
            this.spinner.hide();
            console.error(error);
        });
    };
      
}
