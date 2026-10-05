import React, { useState } from "react";
import { Route, Redirect, Switch, useLocation } from "react-router-dom";
import "./App.css";
import "./Responsive Styles/ResponsiveMobile.css";
import "./Responsive Styles/ResponsiveTablet.css";
import { Home } from "./components/Home Page/Home";
import { LeftPanel } from "./components/Left Panel/LeftPanel";
import { ViewListing } from "./components/Listings/ViewListing";
import { Header } from "./components/Header/Header";
import { NotFound } from "./components/Not Found Page/NotFound";
import { Login } from "./components/Login Page/Login";
import { Locations } from "./components/Locations/Locations";
import { LocationsModal } from "./components/Locations/LocationModal";
import { Bookings } from "./components/Listings/StoredEvents/Bookings";
import { Hosting } from "./components/Login Page/Hosting";
import { AuthProvider } from "./App Context/authContext";
import { ListingsProvider } from "./App Context/listingsContext";
import LanguageIcon from "@mui/icons-material/Language";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import TwitterIcon from "@mui/icons-material/Twitter";

function App() {
  const [bookingsModalOpen, setBookingsModalOpen] = useState(false);
  const [locationsModalOpen, setLocationsModalOpen] = useState(false);

  const openBookings = () => setBookingsModalOpen(true);
  const closeBookings = () => setBookingsModalOpen(false);

  const openLocations = () => setLocationsModalOpen(true);
  const closeLocations = () => setLocationsModalOpen(false);

  const location = useLocation();
  const isHosting = location.pathname.startsWith("/hosting");

  return (
    <AuthProvider>
      <ListingsProvider>
        {!isHosting && (
          <Header onOpenBookings={openBookings} />
        )}
        <main>
          {!isHosting && (
            <LeftPanel
              onOpenBookings={openBookings}
              onSelectLocation={openLocations}
            />
          )}
          <Switch>
            <Route path="/" exact>
              <Redirect to="/home" />
            </Route>
            <Route path="/home">
              <Home />
            </Route>
            <Route path="/viewlisting/:id">
              <ViewListing onOpenBookings={openBookings} />
            </Route>
            <Route path="/login">
              <Login />
            </Route>
            <Route path="/hosting">
              <Hosting />
            </Route>
            <Route path="/locations/:location">
              <Locations />
            </Route>
            <Route path="*">
              <Redirect to="/404pagenotfound" />
              <NotFound />
            </Route>
          </Switch>
          {!isHosting && (
            <footer className="footer">
            <ul>
              <li className="faq-column">
                <span>Support</span>
                <a
                  href="https://www.airbnb.co.za/help/home?from=footer"
                  target="_blank"
                >
                  Help Center
                </a>
                <a
                  href="https://www.airbnb.co.za/help/contact-us?entry=DESKTOP_FOOTER_SAFETY"
                  target="_blank"
                >
                  Get help with a safety issue
                </a>
                <a href="https://www.airbnb.co.za/aircover" target="_blank">
                  AirCover
                </a>
                <a
                  href="https://www.airbnb.co.za/against-discrimination"
                  target="_blank"
                >
                  Anti-discrimination
                </a>
                <a href="https://www.airbnb.co.za/accessibility" target="_blank">
                  Disability Support
                </a>
                <a
                  href="https://www.airbnb.co.za/help/article/2701/extenuating-circumstances-policy-and-the-coronavirus-covid19"
                  target="_blank"
                >
                  Cancellation Options
                </a>
                <a href="https://www.airbnb.co.za/neighbors" target="_blank">
                  Report neighborhood concern
                </a>
              </li>
              <li className="faq-column">
                <span>Hosting</span>
                <a
                  href="https://www.airbnb.co.za/host/homes?from_footer=1"
                  target="_blank"
                >
                  Airbnb your home
                </a>
                <a
                  href="https://www.airbnb.co.za/host/experiences"
                  target="_blank"
                >
                  Airbnb your experience
                </a>
                <a href="https://www.airbnb.co.za/host/services" target="_blank">
                  Airbnb your service
                </a>
                <a
                  href="https://www.airbnb.co.za/aircover-for-hosts"
                  target="_blank"
                >
                  Aircover for Hosts
                </a>
                <a href="https://www.airbnb.co.za/resources" target="_blank">
                  Hosting resources
                </a>
                <a
                  href="https://community.withairbnb.com/t5/Community-Center/ct-p/community-center"
                  target="_blank"
                >
                  Community Forum
                </a>
                <a
                  href="https://www.airbnb.co.za/help/responsible-hosting"
                  target="_blank"
                >
                  Hosting responsibly
                </a>
                <a
                  href="https://www.airbnb.co.za/e/intro-to-hosting"
                  target="_blank"
                >
                  Join a free hosting class
                </a>
                <a href="https://www.airbnb.co.za/host/co-hosts" target="_blank">
                  Find a co-host
                </a>
                <a href="https://www.airbnb.co.za/refer" target="_blank">
                  Refer a host
                </a>
              </li>
              <li className="faq-column">
                <span>Airbnb</span>
                <a href="https://www.airbnb.co.za/release" target="_blank">
                  2026 Summer Release
                </a>
                <a href="https://www.airbnb.co.za/press/news" target="_blank">
                  Newsroom
                </a>
                <a href="https://www.airbnb.co.za/careers" target="_blank">
                  Careers
                </a>
                <a href="https://investors.airbnb.com/" target="_blank">
                  Investors
                </a>
                <a href="https://www.airbnb.org/?locale=en" target="_blank">
                  Airbnb.org Emergency Stays
                </a>
              </li>
            </ul>
            <section>
              <span>
                © 2026 Airbnb. Inc ·{" "}
                <a href="https://www.airbnb.co.za/terms/privacy_policy">
                  Privacy
                </a>{" "}
                · <a href="https://www.airbnb.co.za/terms">Terms</a>
              </span>
              <div className="socials-btns">
                <button>
                  <LanguageIcon />
                </button>
                <button>
                  <a href="https://www.facebook.com/airbnb" target="_blank">
                    <FacebookIcon />
                  </a>
                </button>
                <button>
                  <a href="https://twitter.com/airbnb" target="_blank">
                    <TwitterIcon />
                  </a>
                </button>
                <button>
                  <a href="https://instagram.com/airbnb" target="_blank">
                    <InstagramIcon />
                  </a>
                </button>
              </div>
            </section>
          </footer>
          )}
        </main>
        {bookingsModalOpen && <Bookings onClose={closeBookings} />}
        {locationsModalOpen && (
          <LocationsModal onClose={closeLocations} />
        )}
      </ListingsProvider>
    </AuthProvider>
  );
}

export default App;
