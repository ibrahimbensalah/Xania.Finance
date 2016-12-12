﻿class RatingApp {

    // ReSharper disable once InconsistentNaming
    static RATINGS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

    private rating = 6;
    private highlighted = 6;

    select(rating) {
        this.rating = rating;
    }

    highlight(rating) {
        this.highlighted = rating;
    }

    static lessThanOrEqual(rating, max) {
        return rating <= max;
    }
}