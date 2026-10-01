import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { listings } from "../Listings/listingsData";
import {
  favoritesChangedEvent,
  getStoredFavorites,
  saveFavorites,
} from "../Listings/listingsData";
import { ListingInfo } from "../Listings/ListingInfo";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import "../Listings/Listings.css";
import "../../Responsive Styles/ResponsiveListings.css";
import "./Locations.css";

export const Locations = () => {
  const { location } = useParams();
  const [displayedListings, setDisplayedListings] = useState([]);
  const [favorites, setFavorites] = useState(getStoredFavorites);

  useEffect(() => {
    if (location) {
      const filtered = listings.filter((listing) =>
        listing.location.includes(location)
      );
      setDisplayedListings(filtered);
    }
  }, [location]);

  useEffect(() => {
    const syncFavorites = () => setFavorites(getStoredFavorites());
    window.addEventListener(favoritesChangedEvent, syncFavorites);
    return () => {
      window.removeEventListener(favoritesChangedEvent, syncFavorites);
    };
  }, []);

  const toggleFavorite = (event, id) => {
    event.preventDefault();
    event.stopPropagation();
    const nextfavorites = favorites.includes(id)
      ? favorites.filter((favoriteId) => favoriteId !== id)
      : [...favorites, id];
    saveFavorites(nextfavorites);
    setFavorites(nextfavorites);
  };

  const formatLocation = (loc) => {
    return loc.replace(", South Africa", "");
  };

  return (
    <div className="locations-page">
      <div className="locations-header">
        <h1>{formatLocation(location)}</h1>
        <p>{displayedListings.length} Listings Available</p>
      </div>
      <div className="listing-array">
        <div className="listing-box-container">
          {displayedListings.map((listing) => (
            <Link
              to={`/viewlisting/${listing.id}`}
              className="listing-box"
              key={listing.id}
            >
              <div>
                <span>Trending</span>
                <span
                  className="heart"
                  onClick={(event) => toggleFavorite(event, listing.id)}
                >
                  {favorites.includes(listing.id) ? (
                    <FavoriteIcon />
                  ) : (
                    <FavoriteBorderIcon />
                  )}
                </span>
              </div>
              <ListingInfo
                id={listing.id}
                location={listing.location}
                title={listing.title}
                image={listing.image}
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