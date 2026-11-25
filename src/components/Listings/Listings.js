import React from "react";
import { Link } from "react-router-dom";
import "./Listings.css";
import "../../Responsive Styles/ResponsiveListings.css";
import { ListingInfo } from "./ListingInfo";
import { useListings } from "../../App Context/listingsContext";
import { useFavorites } from "./StoredEvents/Favorites";
import { imageUrl } from "../../API";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";

export const Listings = ({ location }) => {
  const { listings, loading, error } = useListings();
  const { favorites, toggleFavorite } = useFavorites();

  const displayedListings = location
    ? listings
        .filter((listing) => listing.location === location)
        .sort((a, b) => a.location.localeCompare(b.location))
    : listings;

  const toggle = (event, id) => {
    event.preventDefault();
    event.stopPropagation();
    toggleFavorite(id);
  };

  if (loading) {
    return <p className="listings-loading">Loading listings...</p>;
  }

  if (error) {
    return <p className="listings-loading">{error}</p>;
  }

  return (
    <div className="listing-array" id="listings">
      <div className="listing-box-container">
        {displayedListings.map((listing) => (
          <Link
            to={`/viewlisting/${listing._id}`}
            className="listing-box"
            key={listing._id}
          >
            <div>
              <span>Trending</span>
              <span
                className="heart"
                onClick={(event) => toggle(event, listing._id)}
              >
                {favorites.includes(listing._id) ? (
                  <FavoriteIcon />
                ) : (
                  <FavoriteBorderIcon />
                )}
              </span>
            </div>
            <ListingInfo
              id={listing._id}
              location={listing.location}
              title={listing.title}
              image={imageUrl(listing.image)}
              rating={listing.rating}
              price={listing.price}
            />
          </Link>
        ))}
      </div>
    </div>
  );
};