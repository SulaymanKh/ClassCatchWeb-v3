import { Component, OnInit  } from '@angular/core';

@Component({
  selector: 'app-cookie-consent',
  templateUrl: './cookie-consent.component.html',
  styleUrl: './cookie-consent.component.scss'
})
export class CookieConsentComponent implements OnInit {
  isCookieAccepted = false;

  ngOnInit(): void {
    this.isCookieAccepted = this.checkCookieConsent();
  }

  acceptCookies(): void {
    this.isCookieAccepted = true;
    localStorage.setItem('cookieConsent', 'true');
  }

  checkCookieConsent(): boolean {
    return localStorage.getItem('cookieConsent') === 'true';
  }
}