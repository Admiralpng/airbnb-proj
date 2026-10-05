import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useListings } from "../../App Context/listingsContext";
import { useFavorites } from "../Listings/StoredEvents/Favorites";
import { imageUrl } from "../../API";
import { ListingInfo } from "../Listings/ListingInfo";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import "../Listings/Listings.css";
import "../../Responsive Styles/ResponsiveListings.css";
import "./Locations.css";

export const Locations = () => {
  const { location } = useParams();
  const { listings, loading, error } = useListings();
  const { favorites, toggleFavorite } = useFavorites();
  const [displayedListings, setDisplayedListings] = useState([]);

  useEffect(() => {
    if (location) {
      setDisplayedListings(
        listings.filter((listing) => listing.location.includes(location)),
      );
    } else {
      setDisplayedListings([]);
    }
  }, [location, listings]);

  const toggle = (event, id) => {
    event.preventDefault();
    event.stopPropagation();
    toggleFavorite(id);
  };

  const formatLocation = (loc) => loc.replace(", South Africa", "");

  return (
    <div className="locations-page">
      <div className="locations-header">
        <h1>{formatLocation(location || "")}</h1>
        <p>{displayedListings.length} Listings Available</p>
      </div>
      <div className="listing-array">
        <div className="listing-box-container">
          {loading && <p className="listings-loading">Loading listings...</p>}
          {!loading && error && <p className="listings-loading">{error}</p>}
          {!loading &&
            !error &&
            displayedListings.map((listing) => (
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
    </div>
  );
};