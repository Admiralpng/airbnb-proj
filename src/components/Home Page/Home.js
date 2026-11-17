import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import SearchIcon from "@mui/icons-material/Search";
import "./Home.css";
import "../../Responsive Styles/ResponsiveHome.css";

const CITIES = [
  { title: "Cape Town", distance: "Table Mountain views", to: "/locations/Cape Town", media: "ct" },
  { title: "Johannesburg", distance: "City lights and stays", to: "/locations/Johannesburg", media: "jhb" },
  { title: "Durban", distance: "Golden mile sunsets", media: "dhb" },
  { title: "Stellenbosch", distance: "Winelands escapes", media: "stelles" },
];

const SEARCH_LOCATIONS = ["Cape Town", "Johannesburg"];

const CityCard = ({ title, distance, to, media }) => {
  const history = useHistory();
  const body = (
    <>
      <span className={`city-card-media ${media}`} />
      <span className="city-card-body">
        <span className="city-card-title">{title}</span>
        <span className="city-card-distance">{distance}</span>
      </span>
    </>
  );

  return to ? (
    <button type="button" className="city-card" onClick={() => history.push(to)}>
      {body}
    </button>
  ) : (
    <div className="city-card">{body}</div>
  );
};

const SearchPill = ({ onSubmit }) => {
  const history = useHistory();
  const [showLocations, setShowLocations] = useState(false);

  useEffect(() => {
    if (!showLocations) return;
    const close = (e) => {
      if (!e.target.closest(".hero-search-location")) setShowLocations(false);
    };
    document.addEventListener("click", close);
    return () => document.removeEventListener("click", close);
  }, [showLocations]);

  return (
    <div className="hero-search">
      <span
        className="hero-search-field hero-search-location"
        onClick={() => setShowLocations((p) => !p)}
      >
        <span className="hero-search-label">Location</span>
        <span className="hero-search-value">Where are you going?</span>
        {showLocations && (
          <span className="hero-search-dropdown">
            {SEARCH_LOCATIONS.map((location) => (
              <span
                key={location}
                className="hero-search-option"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowLocations(false);
                  history.push(`/locations/${location}`);
                }}
              >
                {location}
              </span>
            ))}
          </span>
        )}
      </span>
      <span className="hero-search-divider" />
      <span className="hero-search-field">
        <span className="hero-search-label">Check in</span>
        <span className="hero-search-value">Add dates</span>
      </span>
      <span className="hero-search-divider" />
      <span className="hero-search-field">
        <span className="hero-search-label">Check out</span>
        <span className="hero-search-value">Add dates</span>
      </span>
      <span className="hero-search-divider" />
      <span className="hero-search-field">
        <span className="hero-search-label">Guests</span>
        <span className="hero-search-value">Add guests</span>
      </span>
      <button type="button" className="hero-search-submit" aria-label="Search" onClick={onSubmit}>
        <SearchIcon />
      </button>
    </div>
  );
};

export const Home = () => {
  const history = useHistory();
  const goToLocations = () => history.push("/locations");

  return (
    <div className="home-page">
      <section className="hero">
        <SearchPill onSubmit={goToLocations} />
        <div className="hero-card">
          <div style={{ borderRadius: "10px", padding: "0 10px", backdropFilter: "blur(2px)" }}>
            <h1>Not sure where to go? Perfect.</h1>
            <button type="button" className="btn btn-light" onClick={goToLocations}>
              I'm flexible
            </button>
          </div>
        </div>
      </section>

      <section className="home-section">
        <div className="home-block">
          <h2 className="home-heading">Inspiration for your next trip</h2>
          <div className="city-row">
            {CITIES.map((city) => (
              <CityCard key={city.title} {...city} />
            ))}
          </div>
        </div>

        <div className="home-block">
          <h2 className="home-heading">Discover Airbnb Experiences</h2>
          <div className="experience-row">
            <div className="experience-card experience-warm">
              <span>Cook with a local chef</span>
            </div>
            <div className="experience-card experience-cool">
              <span>Things to do on your getaway</span>
            </div>
          </div>
        </div>

        <div className="home-block gift-row">
          <div className="gift-copy">
            <h2 className="gift-title">
              Shop Airbnb
              <br />
              gift cards
            </h2>
            <span className="btn btn-outline">Learn more</span>
          </div>
          <div className="gift-media" />
        </div>

        <div className="home-block hosting-card">
          <h2 className="hosting-title">
            Questions
            <br />
            about
            <br />
            hosting?
          </h2>
          <span className="btn btn-light">Become a host</span>
        </div>

        <div className="home-block pre-footer">
          <h2 className="home-heading-sm">Inspiration for future getaways</h2>
          <div className="inspiration-tabs" role="tablist">
            <button type="button" role="tab" aria-selected className="is-active">Popular</button>
            <button type="button" role="tab" aria-selected={false}>Arts & culture</button>
            <button type="button" role="tab" aria-selected={false}>Outdoors</button>
            <button type="button" role="tab" aria-selected={false}>Mountains</button>
            <button type="button" role="tab" aria-selected={false}>Beach</button>
          </div>
          <div className="inspiration-grid">
            <div className="inspiration-col">
              <h3>Popular cities</h3>
              <span>Cape Town</span>
              <span>Johannesburg</span>
            </div>
            <div className="inspiration-col">
              <h3>Weekend escapes</h3>
              <span>Stellenbosch</span>
              <span>Durban</span>
            </div>
            <div className="inspiration-col">
              <h3>Beach stays</h3>
              <span>Camps Bay</span>
              <span>Umhlanga</span>
            </div>
            <div className="inspiration-col">
              <h3>Mountain retreats</h3>
              <span>Drakensberg</span>
              <span>Cederberg</span>
            </div>
          </div>
          <span className="show-more">Show more</span>
        </div>
      </section>
    </div>
  );
};