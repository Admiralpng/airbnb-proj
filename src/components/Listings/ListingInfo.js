import React from "react";
import "./ListingInfo.css";
import "../../Responsive Styles/ResponsiveListings.css";
import GradeTwoToneIcon from "@mui/icons-material/GradeTwoTone";

export const ListingInfo = ({
  id,
  image,
  layoutimgs,
  title,
  address,
  location,
  rating,
  price,
  about,
}) => {
  return (
    <div className="listing">
      <img src={image} alt={title} />
      {layoutimgs}
      <div className="listing-info">
        <h2 className="listing-title">{title}</h2>
        <h3 className="listing-address">{address}</h3>
        <span className="location">
          <img src="/location-pin-svg.svg" alt="event location pin" />:{" "}
          {location}
        </span>
        <p className="product-price">
          From <small>R</small>
          {price}/guest
        </p>
        <div className="rating">
          <span>
            Reviews:{" "}
            {Array(rating)
              .fill()
              .map((_, i) => (
                <GradeTwoToneIcon key={i} />
              ))}
          </span>
          <p className="about-listing">{about}</p>
        </div>
      </div>
    </div>
  );
};
