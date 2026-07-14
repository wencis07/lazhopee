import { Component, OnInit } from '@angular/core';
import { RatingService } from 'src/app/rating/rating.service';

@Component({
  selector: 'app-store-reviews',
  templateUrl: './reviews.component.html',
  styleUrls: ['./reviews.component.css']
})
export class ReviewsComponent implements OnInit {

  ratings: any[] = [];

  constructor(private ratingService: RatingService) {}

  ngOnInit(): void {
    this.loadRatings();
  }

  loadRatings(): void {

    this.ratingService.getStoreRatings().subscribe({

      next: (data: any) => {
        this.ratings = data;
      },

      error: (err) => {
        console.error(err);
      }

    });

  }

}