import React from "react";
import StarIcon from "@material-ui/icons/Star";
import StarBorderIcon from "@material-ui/icons/StarBorder";
import StarHalfIcon from "@material-ui/icons/StarHalf";
import "../styles/Rating.css";

const Rating = (props) => {
  const { rating = 0, numRev = 0, showScore = true } = props;

  return (
    <div className="rating-container" title={`${rating} out of 5 stars`}>
      <div className="stars-row">
        {[1, 2, 3, 4, 5].map((star) => (
          <span key={star} className="star-icon-wrapper">
            {rating >= star ? (
              <StarIcon />
            ) : rating >= star - 0.5 ? (
              <StarHalfIcon />
            ) : (
              <StarBorderIcon />
            )}
          </span>
        ))}
      </div>

      <div className="rating-text-group">
        {showScore && Number(rating) > 0 && (
          <span className="rating-score-pill">{Number(rating).toFixed(1)}</span>
        )}
        <span className="rating-reviews-count">({numRev})</span>
      </div>
    </div>
  );
};

export default Rating;
