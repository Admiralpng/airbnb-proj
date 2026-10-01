import React from "react";
import { useHistory } from "react-router-dom";
import "./LocationModal.css";
import ClearOutlinedIcon from "@mui/icons-material/ClearOutlined";

export const LocationsModal = ({ onClose }) => {
  const history = useHistory();

  const selectLocation = (location) => {
    history.push(`/locations/${location}`);
    onClose();
  };

  return (
    <div className="locations-modal-backdrop" onClick={onClose}>
      <div
        className="locations-modal"
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Choose a location"
      >
        <button
          type="button"
          className="locations-modal-close"
          aria-label="Close locations"
          onClick={onClose}
        >
          <ClearOutlinedIcon />
        </button>
        <h2>Looking for the perfect spot for your getaway?</h2>
        <p>To Browse First Choose a Location</p>
        <div className="locations-modal-options">
          <button
            type="button"
            className="location-option"
            onClick={() => selectLocation("Cape Town")}
          ><strong>
            Cape Town
          </strong>
          </button>
          <button
            type="button"
            className="location-option"
            onClick={() => selectLocation("Johannesburg")}
          ><strong>
            Johannesburg
          </strong>
          </button>
        </div>
      </div>
    </div>
  );
};