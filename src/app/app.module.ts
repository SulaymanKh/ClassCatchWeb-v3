import { BrowserModule } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER  } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterModule } from '@angular/router';
import { AppRoutingModule } from './app.routing';
import { NgxSpinnerModule } from 'ngx-spinner';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { lastValueFrom } from 'rxjs';

import { AppComponent } from './app.component';
import { NavbarComponent } from './shared/navbar/navbar.component';
import { FooterComponent } from './shared/footer/footer.component';

import { ExamplesModule } from './examples/examples.module';
import { NgToastModule } from 'ng-angular-popup';
import { RECAPTCHA_V3_SITE_KEY, RecaptchaV3Module } from 'ng-recaptcha';
import { CookieConsentComponent } from './examples/cookie-consent/cookie-consent.component';
import { AuthService } from 'app/services/auth-service/auth.service';

export function initializeApp(authService: AuthService) {
  return (): Promise<any> => {
    return lastValueFrom(authService.fetchUserInfo());
  };
}

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    FooterComponent,
    CookieConsentComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    RouterModule,
    ExamplesModule,
    AppRoutingModule,
    NgxSpinnerModule,
    NgToastModule,
    RecaptchaV3Module,
    BrowserAnimationsModule
  ],
  providers: [
    AuthService,
    { provide: RECAPTCHA_V3_SITE_KEY, useValue: '6LdBWQkqAAAAAOUM1NEyG59iWU2kn5WXcbRsV-LC' },
    {
      provide: APP_INITIALIZER,
      useFactory: initializeApp,
      deps: [AuthService],
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
