import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { RatingService } from './rating.service';

@Component({
  selector: 'app-rating',
  templateUrl: './rating.component.html',
  styleUrls: ['./rating.component.css']
})
export class RatingComponent {

  productRating = 5;
  shopRating = 5;
  shippingRating = 5;

  comment = '';

  constructor(
    private ratingService: RatingService,
    private dialogRef: MatDialogRef<RatingComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  submitRating() {

    const rating = {
      orderId: this.data.order._id,
      productRating: this.productRating,
    shopRating: this.shopRating,
    shippingRating: this.shippingRating,
    comment: this.comment
    };

    this.ratingService.submitRating(rating).subscribe({

      next: () => {
        alert('Thank you for your feedback!');
        this.dialogRef.close(true);
      },

      error: (err) => {
        alert(err.error?.message || 'Unable to submit rating.');
      }

    });
  }

  close() {
    this.dialogRef.close(false);
  }

}