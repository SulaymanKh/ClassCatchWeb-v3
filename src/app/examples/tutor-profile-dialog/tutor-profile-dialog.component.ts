import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-tutor-profile-dialog',
  templateUrl: './tutor-profile-dialog.component.html',
  styleUrl: './tutor-profile-dialog.component.scss'
})
export class TutorProfileDialogComponent {constructor(
  public dialogRef: MatDialogRef<TutorProfileDialogComponent>,
  @Inject(MAT_DIALOG_DATA) public tutor: any
) { }

  onClose(): void {
    this.dialogRef.close();
  }

  onBookNow(): void {
    // Implement booking logic here or navigate to booking page
    this.dialogRef.close({ book: true, tutor: this.tutor });
  }
}