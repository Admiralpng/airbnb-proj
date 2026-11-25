import React, { useState, useEffect, useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import "./Header.css";
import "../../Responsive Styles/ResponsiveHeader.css";
import AuthContext from "../../App Context/authContext";
import MenuIcon from "@mui/icons-material/Menu";
import PublicIcon from "@mui/icons-material/Public";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import HelpOutlineOutlinedIcon from "@mui/icons-material/HelpOutlineOutlined";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";

export const Header = ({ onOpenBookings, onSelectLocation }) => {
  const { loggedIn, logout } = useContext(AuthContext);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const locroute = useLocation();
  const isHostingRoute = locroute.pathname.startsWith("/hosting");

  const moreHandler = (event) => {
    event.stopPropagation();
    setShowMoreMenu((prev) => !prev);
  };

  useEffect(() => {
    if (!showMoreMenu) return;

    const closeMenu = () => setShowMoreMenu(false);
    document.addEventListener("click", closeMenu);

    return () => document.removeEventListener("click", closeMenu);
  }, [showMoreMenu]);

  return (
    <div className="navbar">
      <nav>
        <Link to="/">
          <svg
            viewBox="0 0 3490 1080"
            style={{
              display: "block",
              width: "102px",
              height: "32px",
              color: "#ff385c",
            }}
          >
            <path
              d="M1494.71 456.953C1458.28 412.178 1408.46 389.892 1349.68 389.892C1233.51 389.892 1146.18 481.906 1146.18 605.892C1146.18 729.877 1233.51 821.892 1349.68 821.892C1408.46 821.892 1458.28 799.605 1494.71 754.83L1500.95 810.195H1589.84V401.588H1500.95L1494.71 456.953ZM1369.18 736.895C1295.33 736.895 1242.08 683.41 1242.08 605.892C1242.08 528.373 1295.33 474.888 1369.18 474.888C1443.02 474.888 1495.49 529.153 1495.49 605.892C1495.49 682.63 1443.8 736.895 1369.18 736.895ZM1656.11 810.195H1750.46V401.588H1656.11V810.195ZM948.912 666.715C875.618 506.859 795.308 344.664 713.438 184.809C698.623 155.177 670.554 98.2527 645.603 67.8412C609.736 24.1733 556.715 0.779785 502.915 0.779785C449.115 0.779785 396.094 24.1733 360.227 67.8412C335.277 98.2527 307.207 155.177 292.392 184.809C210.522 344.664 130.212 506.859 56.9187 666.715C47.5621 687.769 24.9504 737.675 16.3736 760.289C6.2373 787.581 0.779297 817.213 0.779297 846.845C0.779297 975.509 101.362 1079.22 235.473 1079.22C346.193 1079.22 434.3 1008.26 502.915 934.18C571.53 1008.26 659.638 1079.22 770.357 1079.22C904.468 1079.22 1005.83 975.509 1005.83 846.845C1005.83 817.213 999.593 787.581 989.457 760.289C980.88 737.675 958.268 687.769 948.912 666.715ZM502.915 810.195C447.555 738.455 396.094 649.56 396.094 577.819C396.094 506.079 446.776 470.209 502.915 470.209C559.055 470.209 610.516 508.419 610.516 577.819C610.516 647.22 558.275 738.455 502.915 810.195ZM770.357 998.902C688.362 998.902 618.032 941.557 555.741 872.656C619.966 792.541 690.826 679.121 690.826 577.819C690.826 458.513 598.04 389.892 502.915 389.892C407.79 389.892 315.784 458.513 315.784 577.819C315.784 679.098 386.145 792.478 450.144 872.593C387.845 941.526 317.491 998.902 235.473 998.902C146.586 998.902 81.0898 931.061 81.0898 846.845C81.0898 826.57 84.2087 807.856 91.2261 788.361C98.2436 770.426 120.855 720.52 130.212 701.025C203.505 541.17 282.256 380.534 364.126 220.679C378.941 191.047 403.891 141.921 422.605 119.307C442.877 94.3538 470.94... (truncated)"
              fill="currentcolor"
            ></path>
          </svg>
        </Link>
        <div className="nav-pages">
          <h1 className="nav-page">Places to stay</h1>|
          <h1 className="nav-page">Experiences</h1>|
          <h1 className="nav-page">Bookings</h1>
        </div>
        <div className="user-config">
          <button className="globe-btn">
            <PublicIcon />
          </button>
          <button
            className={`profile-toggle ${showMoreMenu ? "is-open" : ""}`}
            aria-label="Open profile menu"
            aria-expanded={showMoreMenu}
            onClick={moreHandler}
          >
            <MenuIcon />
            <span className="profile-avatar">
              <AccountCircleOutlinedIcon />
            </span>
          </button>
          {showMoreMenu && (
            <div
              className={`more-menu ${isHostingRoute ? "onHosting" : ""}`}
              onClick={(event) => event.stopPropagation()}
            >
              <a href="https://www.airbnb.co.za/help" target="_blank">
                <span>
                  <HelpOutlineOutlinedIcon /> <strong>Help Center</strong>
                </span>
              </a>
              <span
                className="more-menu-button"
                onClick={() => {
                  setShowMoreMenu(false);
                  if (onSelectLocation) onSelectLocation();
                }}
              >
                <span>
                  <PublicIcon /> <strong>Locations</strong>
                </span>
              </span>
              <span
                className="more-menu-button"
                onClick={() => {
                  setShowMoreMenu(false);
                  onOpenBookings();
                }}
              >
                <span>
                  <FavoriteBorderIcon />
                  <strong>Bookings</strong>
                </span>
              </span>
              <span
                className="more-menu-button"
                onClick={() => {
                  setShowMoreMenu(false);
                }}
              >
                <span>
                  {loggedIn ? (
                    <Link to="/hosting"><strong>Switch to Hosting</strong></Link>
                  ) : (
                    <Link to="/login"><strong>Become a Host</strong></Link>
                  )}
                </span>
              </span>
              {loggedIn ? (
                <Link
                  to="/home"
                  onClick={() => {
                    logout();
                    setShowMoreMenu(false);
                  }}
                >
                  <span>
                    <strong> Log Out</strong>
                  </span>
                </Link>
              ) : (
                <Link to="/login">
                  <span>
                    <AccountCircleOutlinedIcon />
                    <strong> Login or Signup</strong>
                  </span>
                </Link>
              )}
            </div>
          )}
        </div>
      </nav>
    </div>
  );
};