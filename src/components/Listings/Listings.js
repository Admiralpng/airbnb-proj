import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Listings.css";
import { ListingInfo } from "./ListingInfo";
import {
  favoritesChangedEvent,
  getStoredFavorites,
  listings,
  saveFavorites,
} from "./listingsData";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";

export const Listings = () => {
  const [favorites, setFavorites] = useState(getStoredFavorites);

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

  return (
    <div className="listing-array">
      <div className="listing-box-container">
        {listings.map((listing) => (
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
