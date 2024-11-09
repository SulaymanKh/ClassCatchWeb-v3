import { Component, EventEmitter, Input, Output} from '@angular/core';
import { NgxSpinnerService } from "ngx-spinner";
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'confirmation-signup',
    templateUrl: './confirmationSignup.component.html',
    styleUrls: ['./confirmationSignup.component.scss']
})
export class ConfirmationSignup {
    @Input() name;
    @Input() isTutor: boolean;
    @Output() cancelEvent = new EventEmitter<void>();
    @Output() confirmEvent = new EventEmitter<void>();
  
    constructor(public activeModal: NgbActiveModal) {}

    cancelRegistration() {
        this.cancelEvent.emit();
    }
  
    confirmRegistration() {
        this.confirmEvent.emit();
    }
}