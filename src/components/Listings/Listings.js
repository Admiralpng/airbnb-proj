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
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";

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

  const smoothScroll = (element, target, duration) => {
    const start = element.scrollLeft;
    const change = target - start;
    const startTime = performance.now();

    const animateScroll = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const ease =
        progress < 0.5
          ? 2 * progress * progress
          : -1 + (4 - 2 * progress) * progress;
      element.scrollLeft = start + change * ease;
      if (progress < 1) {
        requestAnimationFrame(animateScroll);
      }
    };

    requestAnimationFrame(animateScroll);
  };

  const handleScroll = (direction, event) => {
    const container = event.currentTarget
      .closest(".listing-array")
      .querySelector(".listing-box-container");
    const scrollAmount = 333.7;
    const targetScroll =
      container.scrollLeft +
      (direction === "left" ? -scrollAmount : scrollAmount);
    smoothScroll(container, targetScroll, 400);
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
      <div className="arrow-nav">
        <button
          className="scroll-arrow"
          onClick={(event) => handleScroll("left", event)}
        >
          <NavigateBeforeIcon />
        </button>
        <button
          className="scroll-arrow"
          onClick={(event) => handleScroll("right", event)}
        >
          <NavigateNextIcon />
        </button>
      </div>
    </div>
  );
};