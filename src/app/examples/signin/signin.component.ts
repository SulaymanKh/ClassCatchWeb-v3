import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from "ngx-spinner";
import { Router } from '@angular/router';

@Component({
    selector: 'app-signin',
    templateUrl: './signin.component.html',
    styleUrls: ['./signin.component.scss']
})
export class SigninComponent implements OnInit {
    test : Date = new Date();
    focus;
    focus1;
    responseMessage: string | null = null;
    responseType: 'success' | 'error' | null = null;
    loading = false;

    constructor(private spinner: NgxSpinnerService, private router: Router) { }

    ngOnInit() {
    }

    signIn(username, password){
        this.loading = true;
        this.spinner.show();

        fetch("https://api.classcatch.co.uk/api/Auth/signin", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
                "username": username,
                "password": password
            })
        })
        .then((response) => {
            this.loading = false;
            this.spinner.hide();

          if (response.status == 200) {
            this.responseType = 'success';
            return response.text();
          } else if (response.status == 400 || response.status == 401){
            this.responseType = 'error';
            return response.text();
          } else{
            this.responseType = 'error';
            throw new Error("Signing In failed");
          }
        })
        .then((data) => {
            if (this.responseType == 'success'){
                localStorage.setItem('authToken', data);
                console.log("logged in");
                this.router.navigate(['/user-profile']);
            }else {
                this.responseMessage = data;
            }
        })
        .catch((error) => {
            this.loading = false;
            this.spinner.hide();
            console.error(error);
        });
    }
}
