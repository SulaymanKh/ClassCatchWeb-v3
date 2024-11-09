import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { environment } from 'environments/environment.prod';
import { ReCaptchaV3Service } from 'ng-recaptcha';

@Component({
    selector: 'app-landing',
    templateUrl: './landing.component.html',
    styleUrls: ['./landing.component.scss']
})
export class LandingComponent implements OnInit, AfterViewInit {
    focus: any;
    focus1: any;
    messageSent: boolean = false;
    recaptchaToken: string | null = null;

    constructor(
        private router: Router,
        private recaptchaV3Service: ReCaptchaV3Service,
    ) { }

    ngOnInit() {
    }
    
    ngAfterViewInit() {
        // Ensure Intersection Observer is supported
        if ('IntersectionObserver' in window) {
            const observer = new IntersectionObserver(entries => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("in-view");
                        if (entry.target.classList.contains('achievement-title')) {
                            this.startCounter(entry.target as HTMLElement);
                        }
                        observer.unobserve(entry.target);
                    }
                });
            }, {
                threshold: 0.3 // Adjust as needed
            });

            // Observe each achievement-title element
            const counters = document.querySelectorAll('.achievement-title');
            counters.forEach(counter => {
                observer.observe(counter);
            });

            // Observe each element with data-animate attribute
            const elementsToAnimate = document.querySelectorAll("[data-animate]");
            elementsToAnimate.forEach(element => {
                observer.observe(element);
            });

        } else {
            // Fallback for browsers that don't support Intersection Observer
            console.warn('Intersection Observer is not supported in this browser.');
            // Alternatively, you could add animations using a different approach for fallback
        }
    }

    startCounter(counter: HTMLElement) {
        const target = +counter.getAttribute('data-count')!;
        const speed = 700; // Increase this value to make the counter increment more slowly
    
        const updateCount = () => {
            const count = +counter.innerText;
            const increment = target / speed;
    
            if (count < target) {
                counter.innerText = `${Math.ceil(count + increment)}`;
                setTimeout(updateCount, 20); // Adjust the interval here
            } else {
                counter.innerText = `${target}`;
            }
        };
    
        updateCount();
    }

    redirectToSignup(userType: string) {
        if (userType === 'tutor') {
            this.router.navigate(['/signup'], { queryParams: { userType: 'tutor' } });
        } else if (userType === 'student') {
            this.router.navigate(['/signup'], { queryParams: { userType: 'student' } });
        }
    }

    sendMessage(contactForm: NgForm) {
        this.recaptchaV3Service.execute('importantAction')
            .subscribe((token: string) => {
                this.recaptchaToken = token;
    
                if (contactForm.valid && this.recaptchaToken) {
                    const formData = {
                        recipient: contactForm.value.email,
                        subject: contactForm.value.name,
                        body: contactForm.value.message
                    };
    
                    fetch("https://api.classcatch.co.uk/api/ClassCatch/Account/send-email", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(formData) 
                    })
                    .then((response) => response.json())
                    .then((data) => {
                        if (!data.isError) { 
                            this.messageSent = true;
                            contactForm.resetForm();
                            this.recaptchaToken = null;
                        } else {
                            this.messageSent = false;
                        }
                    })
                    .catch((error) => {
                        console.error(error);
                    });
                }
            });
    }
    

    onRecaptchaResolved(token: string) {
        this.recaptchaToken = token;
    }
}
