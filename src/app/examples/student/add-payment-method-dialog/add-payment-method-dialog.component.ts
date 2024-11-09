// add-payment-method-dialog.component.ts
import { Component, OnInit, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { loadStripe, Stripe, StripeElements, StripeCardNumberElement, StripeCardExpiryElement, StripeCardCvcElement } from '@stripe/stripe-js';

@Component({
  selector: 'app-add-payment-method-dialog',
  templateUrl: './add-payment-method-dialog.component.html',
})
export class AddPaymentMethodDialogComponent implements OnInit, AfterViewInit {
  @ViewChild('cardNumberElement', { static: false }) cardNumberElement: ElementRef;
  @ViewChild('cardExpiryElement', { static: false }) cardExpiryElement: ElementRef;
  @ViewChild('cardCvcElement', { static: false }) cardCvcElement: ElementRef;

  stripe: Stripe | null = null;
  elements: StripeElements | null = null;
  cardNumber: StripeCardNumberElement | null = null;
  cardExpiry: StripeCardExpiryElement | null = null;
  cardCvc: StripeCardCvcElement | null = null;
  cardError: string = '';
  cardHolderName: string = '';

  constructor(public dialogRef: MatDialogRef<AddPaymentMethodDialogComponent>) {}

  async ngOnInit() {
    this.stripe = await loadStripe('pk_test_51PcPFRRuaXC1eP8biRTa1x2EsIxGKM5TImhQcCvs9FEzgLf07HbR4zWv9vJZlJNB2A9zH817w7enXXd8HfA29S3200ir6r1VZW');
    this.elements = this.stripe.elements({ appearance: { theme: 'stripe' } });

    const style = {
      base: {
        iconColor: '#f5593d',
        color: '#000',
        fontSize: '16px',
        fontSmoothing: 'antialiased',
        '::placeholder': {
          color: '#87bbfd',
        },
        ':-webkit-autofill': {
          color: '#f5593d',
        },
      },
      invalid: {
        iconColor: '#f5593d',
        color: '#ff4d4d',
      },
    };

    this.cardNumber = this.elements.create('cardNumber', { style, showIcon: true, iconStyle: 'solid' });
    this.cardNumber.mount(this.cardNumberElement.nativeElement);

    this.cardExpiry = this.elements.create('cardExpiry', { style });
    this.cardExpiry.mount(this.cardExpiryElement.nativeElement);

    this.cardCvc = this.elements.create('cardCvc', { style });
    this.cardCvc.mount(this.cardCvcElement.nativeElement);

    const handleCardChange = (event: any) => {
      this.cardError = event.error ? event.error.message : '';
    };

    this.cardNumber.on('change', handleCardChange);
    this.cardExpiry.on('change', handleCardChange);
    this.cardCvc.on('change', handleCardChange);
  }

  ngAfterViewInit() {
    // Any additional initialization after view has been loaded
  }

  async onAdd() {
    if (!this.stripe || !this.cardNumber) {
      return;
    }

    const { token, error } = await this.stripe.createToken(this.cardNumber);

    if (error) {
      this.cardError = error.message;
    } else if (token) {
      this.dialogRef.close({ token: token.id, name: this.cardHolderName   });
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
