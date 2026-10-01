import React, { useState, useMemo, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ListingInfo } from "./ListingInfo";
import { listings } from "./listingsData";
import {
  favoritesChangedEvent,
  getStoredFavorites,
  saveFavorites,
} from "./listingsData";
import { nanoid } from "nanoid";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import "./ViewListing.css";
import "../../Responsive Styles/ResponsiveViewListing.css";

const addDays = (dateString, days) => {
  const date = new Date(dateString);
  date.setDate(date.getDate() + days);
  return date.toISOString().split("T")[0];
};

export const ViewListing = ({ onOpenBookings }) => {
  const { id } = useParams();
  const listing = useMemo(() => listings.find((l) => l.id === id), [id]);
  const [guestQty, setGuestsQty] = useState(1);
  const [checkInDate, setCheckInDate] = useState(
    () => new Date().toISOString().split("T")[0],
  );
  const [checkOutDate, setCheckOutDate] = useState(() =>
    addDays(new Date().toISOString().split("T")[0], 1),
  );
  const [cancellationDate, setCancellationDate] = useState(
    () =>
      new Date(Date.now() - Math.floor(Math.random() * 5 + 1) * 86400000)
        .toISOString()
        .split("T")[0],
  );
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

  const handleCheckInChange = (event) => {
    const nextCheckIn = event.target.value;
    setCheckInDate(nextCheckIn);
    setCheckOutDate((currentCheckOut) =>
      currentCheckOut <= nextCheckIn
        ? addDays(nextCheckIn, 1)
        : currentCheckOut,
    );
  };

  const handleCheckOutChange = (event) => {
    const nextCheckOut = event.target.value;
    setCheckOutDate(
      nextCheckOut > checkInDate ? nextCheckOut : addDays(checkInDate, 1),
    );
  };

  const tripTotal = listing ? Number(listing.price) * Number(guestQty || 0) : 0;

  const getStoredBookings = () => {
    try {
      const storedBookings = JSON.parse(
        window.localStorage.getItem("bookings"),
      );
      return Array.isArray(storedBookings) ? storedBookings : [];
    } catch (error) {
      return [];
    }
  };

  const handleReserveBooking = (event) => {
    event.preventDefault();

    if (!listing) return;

    const booking = {
      id: nanoid(),
      listingId: listing.id,
      title: listing.title,
      location: listing.location,
      address: listing.address,
      image: listing.image,
      layoutImages: listing.layoutimgs,
      rating: listing.rating,
      price: listing.price,
      guests: Number(guestQty),
      checkIn: checkInDate,
      checkOut: checkOutDate,
      total: tripTotal,
      about: listing.about,
    };

    try {
      window.localStorage.setItem(
        "bookings",
        JSON.stringify([...getStoredBookings(), booking]),
      );

      setTimeout(() => {
        onOpenBookings();
        alert("Reservation Successful");
      }, 2000);
    } catch (error) {
      onOpenBookings();
    }
  };

  useEffect(() => {
    const daysBefore = Math.floor(Math.random() * 5 + 1);
    const newCancellation = new Date(
      new Date(checkInDate).getTime() - daysBefore * 86400000,
    )
      .toISOString()
      .split("T")[0];
    setCancellationDate(newCancellation);
  }, [checkInDate]);

  if (!listing) {
    return (
      <div className="listing-notfound">
        <Link to="/">
          <img
            src="https://cdn.dribbble.com/userupload/26627208/file/original-997cfd86b7e1e12f436cfde62fc88b44.gif"
            alt="404 Page Not Found"
          />
        </Link>
        <div>
          <h1>Listing Not Found</h1>
          <p>
            The page you are looking for does not exist. Please check the URL or
            return to the <Link to="/">homepage</Link>.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="view-listing">
      <div className="listing-viewbox">
        <div className="book-listing">
          <div className="listing-preview">
            <div className="listing-image-wrapper">
              <img src={listing.image} alt={listing.title} />
              <span
                className="view-favorite"
                onClick={(event) => toggleFavorite(event, listing.id)}
              >
                {favorites.includes(listing.id) ? (
                  <FavoriteIcon />
                ) : (
                  <FavoriteBorderIcon />
                )}
              </span>
            </div>
            <div className="img-layout">
              {listing.layoutimgs.map((image) => (
                <img key={image.src} src={image.src} alt={listing.title} />
              ))}
            </div>
          </div>
          <section>
            <h1>{listing.title}</h1>
            <h2>{listing.address}</h2>
            <span>
              <img src="/location-pin-svg.svg" alt="event location pin" />
              Location : {listing.location}
            </span>
            <p>
              From <small>R</small>
              {listing.price}/guest
            </p>
            <div>
              Rating:{" "}
              {Array(listing.rating)
                .fill()
                .map((_, i) => (
                  <span key={i}>★</span>
                ))}
            </div>
            <div className="about-listing">
              <h2>About this space</h2>
              <p>{listing.about}</p>
            </div>
          </section>
        </div>
        <div className="booking-details">
          <div className="anemities">
            <h2>Features :</h2>
            <ul>
              <li>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 32 32"
                  aria-hidden="true"
                  role="presentation"
                  focusable="false"
                  style={{
                    display: "block",
                    height: "24px",
                    width: "24px",
                    fill: "currentcolor",
                  }}
                >
                  <path d="M16 20.33a3.67 3.67 0 1 1 0 7.34 3.67 3.67 0 0 1 0-7.34zm0 2a1.67 1.67 0 1 0 0 3.34 1.67 1.67 0 0 0 0-3.34zM16 15a9 9 0 0 1 8.04 4.96l-1.51 1.51a7 7 0 0 0-13.06 0l-1.51-1.51A9 9 0 0 1 16 15zm0-5.33c4.98 0 9.37 2.54 11.94 6.4l-1.45 1.44a12.33 12.33 0 0 0-20.98 0l-1.45-1.45A14.32 14.32 0 0 1 16 9.66zm0-5.34c6.45 0 12.18 3.1 15.76 7.9l-1.43 1.44a17.64 17.64 0 0 0-28.66 0L.24 12.24c3.58-4.8 9.3-7.9 15.76-7.9z"></path>
                </svg>
                Wifi
              </li>
              <li>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 32 32"
                  aria-hidden="true"
                  role="presentation"
                  focusable="false"
                  style={{
                    display: "block",
                    height: "24px",
                    width: "24px",
                    fill: "currentcolor",
                  }}
                >
                  <path d="M17 1v4.03l4.03-2.32 1 1.73L17 7.34v6.93l6-3.47V5h2v4.65l3.49-2.02 1 1.74L26 11.38l4.03 2.33-1 1.73-5.03-2.9L18 16l6 3.46 5.03-2.9 1 1.73L26 20.62l3.49 2.01-1 1.74L25 22.35V27h-2v-5.8l-6-3.47v6.93l5.03 2.9-1 1.73L17 26.97V31h-2v-4.03l-4.03 2.32-1-1.73 5.03-2.9v-6.93L9 21.2V27H7v-4.65l-3.49 2.02-1-1.74L6 20.62l-4.03-2.33 1-1.73L8 19.46 14 16l-6-3.46-5.03 2.9-1-1.73L6 11.38 2.51 9.37l1-1.74L7 9.65V5h2v5.8l6 3.47V7.34l-5.03-2.9 1-1.73L15 5.03V1z"></path>
                </svg>
                Air-Conditioning
              </li>
              <li>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 32 32"
                  aria-hidden="true"
                  role="presentation"
                  focusable="false"
                  style={{
                    display: "block",
                    height: "24px",
                    width: "24px",
                    fill: "currentcolor",
                  }}
                >
                  <path d="M25 1a3 3 0 0 1 3 2.82V26a3 3 0 0 1-2.82 3H25v2h-2v-2H9v2H7v-2a3 3 0 0 1-3-2.82V4a3 3 0 0 1 2.82-3H25zm1 20H6v5a1 1 0 0 0 .88 1H25a1 1 0 0 0 1-.88V21zm-10 2a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm9-20h-8v16h9V4a1 1 0 0 0-.88-1H25zM15 3H7a1 1 0 0 0-1 .88V19h9V3zm-3 8a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm8 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"></path>
                </svg>
                Bedroom Utilities
              </li>
              <li>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 32 32"
                  aria-hidden="true"
                  role="presentation"
                  focusable="false"
                  style={{
                    display: "block",
                    height: "24px",
                    width: "24px",
                    fill: "currentcolor",
                  }}
                >
                  <path d="M11 1v7l1.9 20.82v.17a2.01 2.01 0 0 1-1.81 2 2 2 0 0 1-.18.01H2.92a2.01 2.01 0 0 1-1.82-2v-.09l1.9-21V1zm6 0h.15a2 2 0 0 1 1.84 1.84L19 3v7.12l-2 8V31h-2V17.96l.03-.16.03-.16L16.72 11H13V1zm11 0a2 2 0 0 1 2 1.85V29a2 2 0 0 1-1.85 2H21v-2h7v-2h-7v-2h7v-2h-7v-2h7v-2h-7v-2h7v-2h-7v-2h7v-2h-7V9h7V7h-7V5h7V3h-7V1zM9.09 9H4.9L3.1 29h7.81v-.06zM17 3h-2v6h2zM9 3H5v4h4z"></path>
                </svg>
                Bathroom Utilities
              </li>
              <li>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 32 32"
                  aria-hidden="true"
                  role="presentation"
                  focusable="false"
                  style={{
                    display: "block",
                    height: "24px",
                    width: "24px",
                    fill: "currentcolor",
                  }}
                >
                  <path d="M29 1v2a13 13 0 0 0-.3 26h.3v2a15 15 0 0 1-.31-30zM3 1h2v6h2V1h2v6h2V1h2v9a5 5 0 0 1-4 4.9V31H7V14.9a5.01 5.01 0 0 1-3.98-4.44L3 10.22V10zm26 6v2a7 7 0 0 0-.24 14H29v2a9 9 0 0 1-.27-18zM11 9H5v1.15a3 3 0 0 0 6 .03V10z"></path>
                </svg>
                Kitchen Utilities
              </li>
              <li>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 32 32"
                  aria-hidden="true"
                  role="presentation"
                  focusable="false"
                  style={{
                    display: "block",
                    height: "24px",
                    width: "24px",
                    fill: "currentcolor",
                  }}
                >
                  <path d="M16 1c4.26 0 7.6 4.44 7.97 10h.91a2 2 0 0 1 2 2v.22l-1.79 16A2 2 0 0 1 23.26 31l-.16.01H8.9a2 2 0 0 1-1.97-1.62l-.02-.16L6.44 25H5a2 2 0 0 1-2-1.85V14a5 5 0 0 1 4.78-5h.52c.94-4.62 4-8 7.7-8zm8.21 18H17v4a2 2 0 0 1-1.85 2h-6.7l.45 4h14.2zM15 21H5v2h10zm0-10H8a3 3 0 0 0-3 2.82V19h10zm9.88 2H17v4h7.44zM16 3c-2.52 0-4.8 2.44-5.65 6H15a2 2 0 0 1 2 1.85V11h4.96c-.34-4.55-2.95-8-5.96-8z"></path>
                </svg>
                Cleaning Products
              </li>
              <li>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 32 32"
                  aria-hidden="true"
                  role="presentation"
                  focusable="false"
                  style={{
                    display: "block",
                    height: "24px",
                    width: "24px",
                    fill: "currentcolor",
                  }}
                >
                  <path d="M24 26c.99 0 1.95.35 2.67 1 .3.29.71.45 1.14.5H28v2h-.23a3.96 3.96 0 0 1-2.44-1A1.98 1.98 0 0 0 24 28c-.5 0-.98.17-1.33.5a3.98 3.98 0 0 1-2.67 1 3.98 3.98 0 0 1-2.67-1A1.98 1.98 0 0 0 16 28c-.5 0-.98.17-1.33.5a3.98 3.98 0 0 1-2.67 1 3.98 3.98 0 0 1-2.67-1A1.98 1.98 0 0 0 8 28c-.5 0-.98.17-1.33.5a3.96 3.96 0 0 1-2.44 1H4v-2h.19a1.95 1.95 0 0 0 1.14-.5A3.98 3.98 0 0 1 8 26c.99 0 1.95.35 2.67 1 .35.33.83.5 1.33.5.5 0 .98-.17 1.33-.5A3.97 3.97 0 0 1 16 26c.99 0 1.95.35 2.67 1 .35.33.83.5 1.33.5.5 0 .98-.17 1.33-.5A3.98 3.98 0 0 1 24 26zm0-5c.99 0 1.95.35 2.67 1 .3.29.71.45 1.14.5H28v2h-.23a3.96 3.96 0 0 1-2.44-1A1.98 1.98 0 0 0 24 23c-.5 0-.98.17-1.33.5a3.98 3.98 0 0 1-2.67 1 3.98 3.98 0 0 1-2.67-1A1.98 1.98 0 0 0 16 23c-.5 0-.98.17-1.33.5a3.98 3.98 0 0 1-2.67 1 3.98 3.98 0 0 1-2.67-1A1.98 1.98 0 0 0 8 23c-.5 0-.98.17-1.33.5a3.96 3.96 0 0 1-2.44 1H4v-2h.19a1.95 1.95 0 0 0 1.14-.5A3.98 3.98 0 0 1 8 21c.99 0 1.95.35 2.67 1 .35.33.83.5 1.33.5.5 0 .98-.17 1.33-.5A3.97 3.97 0 0 1 16 21c.99 0 1.95.35 2.67 1 .35.33.83.5 1.33.5.5 0 .98-.17 1.33-.5A3.98 3.98 0 0 1 24 21zM20 3a4 4 0 0 1 4 3.8V9h4v2h-4v5a4 4 0 0 1 2.5.86l.17.15c.3.27.71.44 1.14.48l.19.01v2h-.23a3.96 3.96 0 0 1-2.44-1A1.98 1.98 0 0 0 24 18c-.5 0-.98.17-1.33.5a3.98 3.98 0 0 1-2.67 1 3.98 3.98 0 0 1-2.67-1A1.98 1.98 0 0 0 16 18c-.5 0-.98.17-1.33.5a3.98 3.98 0 0 1-2.67 1 3.98 3.98 0 0 1-2.67-1A1.98 1.98 0 0 0 8 18c-.5 0-.98.17-1.33.5a3.96 3.96 0 0 1-2.44 1H4v-2h.19a1.95 1.95 0 0 0 1.14-.5A3.98 3.98 0 0 1 8 16c.99 0 1.95.35 2.67 1 .35.33.83.5 1.33.5.5 0 .98-.17 1.33-.5a3.96 3.96 0 0 1 2.44-1H16v-5H4V9h12V7a2 2 0 0 0-4-.15V7h-2a4 4 0 0 1 7-2.65A3.98 3.98 0 0 1 20 3zm-2 13.52.46.31.21.18c.35.31.83.49 1.33.49a2 2 0 0 0 1.2-.38l.13-.11c.2-.19.43-.35.67-.49V11h-4zM20 5a2 2 0 0 0-2 1.85V9h4V7a2 2 0 0 0-2-2z"></path>
                </svg>
                Pool
              </li>
              <li>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 32 32"
                  aria-hidden="true"
                  role="presentation"
                  focusable="false"
                  style={{
                    display: "block",
                    height: "24px",
                    width: "24px",
                    fill: "currentcolor",
                  }}
                >
                  <path d="M26 19a1 1 0 1 1-2 0 1 1 0 0 1 2 0zM7 18a1 1 0 1 0 0 2 1 1 0 0 0 0-2zm20.7-5 .41 1.12A4.97 4.97 0 0 1 30 18v9a2 2 0 0 1-2 2h-2a2 2 0 0 1-2-2v-2H8v2a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-9c0-1.57.75-2.96 1.89-3.88L4.3 13H2v-2h3v.15L6.82 6.3A2 2 0 0 1 8.69 5h14.62c.83 0 1.58.52 1.87 1.3L27 11.15V11h3v2h-2.3zM6 25H4v2h2v-2zm22 0h-2v2h2v-2zm0-2v-5a3 3 0 0 0-3-3H7a3 3 0 0 0-3 3v5h24zm-3-10h.56L23.3 7H8.69l-2.25 6H25zm-15 7h12v-2H10v2z"></path>
                </svg>
                Free Parking
              </li>
              <li>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 32 32"
                  aria-hidden="true"
                  role="presentation"
                  focusable="false"
                  style={{
                    display: "block",
                    height: "24px",
                    width: "24px",
                    fill: "currentcolor",
                  }}
                >
                  <path d="M9 29v-2h2v-2H6a5 5 0 0 1-5-4.78V8a5 5 0 0 1 4.78-5H26a5 5 0 0 1 5 4.78V20a5 5 0 0 1-4.78 5H21v2h2v2zm10-4h-6v2h6zm7-20H6a3 3 0 0 0-3 2.82V20a3 3 0 0 0 2.82 3H26a3 3 0 0 0 3-2.82V8a3 3 0 0 0-2.82-3z"></path>
                </svg>
                HDTV
              </li>
              <li>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 32 32"
                  aria-hidden="true"
                  role="presentation"
                  focusable="false"
                  style={{
                    display: "block",
                    height: "24px",
                    width: "24px",
                    fill: "currentcolor",
                  }}
                >
                  <path d="M23 1a2 2 0 0 1 2 1.85V19h4v2h-2v8h2v2H3v-2h2v-8H3v-2h4V3a2 2 0 0 1 1.85-2H9zM9 21H7v8h2zm4 0h-2v8h2zm4 0h-2v8h2zm4 0h-2v8h2zm4 0h-2v8h2zm-10-8H9v6h6zm8 0h-6v6h6zM15 3H9v8h6zm8 0h-6v8h6z"></path>
                </svg>
                Private Balcony
              </li>
              <li>
                <img
                  src="https://www.svgrepo.com/show/382996/washing-machine-washing-machine-washingmachine.svg"
                  style={{
                    display: "block",
                    height: "24px",
                    width: "24px",
                    fill: "currentcolor",
                  }}
                ></img>
                Washer
              </li>
              <li>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 32 32"
                  aria-hidden="true"
                  role="presentation"
                  focusable="false"
                  style={{
                    display: "block",
                    height: "24px",
                    width: "24px",
                    fill: "currentcolor",
                  }}
                >
                  <path d="M13 2h2c0 2.06-.48 3.34-1.77 5.42l-.75 1.19C11.6 10 11.2 10.9 11.06 12H9.04c.1-1.07.38-1.97.9-3H6a10 10 0 0 0 20 .28V9h-3.77a7.44 7.44 0 0 0-1.17 3h-2.02c.15-1.61.71-2.84 1.91-4.73l.57-.88c1.11-1.79 1.47-2.78 1.47-4.4h2c0 1.93-.4 3.17-1.5 5L28 7v2c0 .68-.06 1.35-.17 2H30v2h-2.68a12.04 12.04 0 0 1-5.9 6.7l4.5 9.89-1.83.82-2-4.41H17v4h-2v-4H9.92L7.9 30.41l-1.82-.82 4.49-9.88A12.04 12.04 0 0 1 4.68 13H2v-2h2.17A12.06 12.06 0 0 1 4 9.3V7h7.13l.39-.6c1.11-1.8 1.47-2.8 1.47-4.4zm-.57 18.46L10.83 24H15v-3.04a11.95 11.95 0 0 1-2.57-.5zm4.57.5V24h4.17l-1.6-3.54c-.69.21-1.4.37-2.13.45zM18 2h2c0 2.06-.48 3.35-1.77 5.42l-.75 1.19C16.6 10 16.2 10.9 16.06 12h-2.02c.15-1.62.71-2.84 1.91-4.74l.57-.88C17.63 4.6 17.99 3.61 17.99 2z"></path>
                </svg>
                BBQ Grill
              </li>
            </ul>
          </div>
          <div className="booking-calculator">
            <form onSubmit={handleReserveBooking}>
              <span>
                <h2>Number of Guests :</h2>
                <input
                  type="number"
                  min="1"
                  max="20"
                  value={guestQty}
                  onChange={(event) => setGuestsQty(event.target.value)}
                />
              </span>
              <span>
                <small>
                  <strong>CHECK-IN</strong>
                </small>
              </span>
              <input
                className="calendar"
                type="date"
                value={checkInDate}
                onChange={handleCheckInChange}
              ></input>
              <span>
                <small>
                  <strong>CHECK-OUT</strong>
                </small>
              </span>
              <input
                className="calendar"
                type="date"
                value={checkOutDate}
                min={addDays(checkInDate, 1)}
                onChange={handleCheckOutChange}
              ></input>
              <span id="cancellation-event">
                <svg
                  viewBox="0 0 32 32"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                  role="presentation"
                  focusable="false"
                  style={{
                    display: "block",
                    height: "24px",
                    width: "24px",
                    fill: "currentColor",
                  }}
                >
                  <path d="m12 0v2h8v-2h2v2h6c1.1045695 0 2 .8954305 2 2v21c0 2.7614237-2.2385763 5-5 5h-18c-2.76142375 0-5-2.2385763-5-5v-21c0-1.1045695.8954305-2 2-2h6v-2zm16 12h-24v13c0 1.6568542 1.34314575 3 3 3h18c1.6568542 0 3-1.3431458 3-3zm-8.2071068 2.2928932 1.4142136 1.4142136-3.7921068 3.7928932 3.7921068 3.7928932-1.4142136 1.4142136-3.7928932-3.7921068-3.7928932 3.7921068-1.4142136-1.4142136 3.7921068-3.7928932-3.7921068-3.7928932 1.4142136-1.4142136 3.7928932 3.7921068zm-9.7928932-10.2928932h-6v6h24v-6h-6v2h-2v-2h-8v2h-2z"></path>
                </svg>
                Cancellation Policy - Valid before - {cancellationDate}
              </span>
              <div className="trip-total">
                <span>Trip total:</span>
                <span>R{tripTotal.toFixed(2)}</span>
              </div>
              <button type="submit">Reserve Booking</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
