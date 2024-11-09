import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-payment-card',
  templateUrl: './payment-card.component.html',
  styleUrl: './payment-card.component.scss'
})
export class PaymentCardComponent {
  @Input('flip') flip = false;

  _no: string = "---- ---- ---- ----";
  _cvc: string = "---";

  @Input('no') set no(value) {
    if (value) {
      this._no = this.formatCreditCardNumber(value);
    }
  }

  @Input('cvc') set cvc(val) {
    if (val) this._cvc = val;
  }

  @Input('holder') holder: string = "----- ----"
  @Input('month') month: string =  "--";
  @Input('year') year: string = "--";

  formatCreditCardNumber(value) {
    console.log(value);
    var v = value.replace(/\s+/g, '').replace(/([^0-9])/gi, '')
    var matches = v.match(/\d{4,16}/g);
    var match = matches && matches[0] || ''
    var parts = []
    for (var i=0, len=match.length; i<len; i+=4) {
      parts.push(match.substring(i, i+4))
    }
    if (parts.length) {
      return parts.join(' ')
    } else {
      return value
    }
  }
}
