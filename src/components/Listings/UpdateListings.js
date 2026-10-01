import React, { useState, useEffect, useRef, useCallback } from "react";
import "./UpdateListings.css";
import { nanoid } from "nanoid";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import {
  listings,
  addListing,
  removeListing,
  saveListings,
} from "./listingsData";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import ClearOutlinedIcon from "@mui/icons-material/ClearOutlined";

const SLIDE_LABELS = ["Details", "Photos", "Pricing", "Review"];

const readFileAsDataURL = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

export const EditnAddListings = ({
  isOpen,
  onClose,
  listingToEdit,
  onListingSaved,
  onListingRemoved,
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const trackRef = useRef(null);

  const [formData, setFormData] = useState({
    title: "",
    location: "",
    address: "",
    price: "",
    about: "",
    mainImageData: null,
    mainImageName: "",
    layoutImagesData: [],
  });

  const [errors, setErrors] = useState({});
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const locationDropdownRef = useRef(null);

  const LOCATION_OPTIONS = ["Johannesburg", "Cape Town"];

  const isEditMode = !!listingToEdit;

  useEffect(() => {
    if (isOpen) {
      if (listingToEdit) {
        setFormData({
          title: listingToEdit.title || "",
          location: listingToEdit.location?.replace(", South Africa", "") || "",
          address: listingToEdit.address || "",
          price: listingToEdit.price?.toString() || "",
          about: listingToEdit.about || "",
          mainImageData: listingToEdit.image || null,
          mainImageName: "",
          layoutImagesData:
            listingToEdit.layoutimgs?.map((img) => ({
              src: img.src,
            })) || [],
        });
      } else {
        setFormData({
          title: "",
          location: "",
          address: "",
          price: "",
          about: "",
          mainImageData: null,
          mainImageName: "",
          layoutImagesData: [],
        });
      }
      setCurrentSlide(0);
      setDirection(0);
      setErrors({});
    }
  }, [isOpen, listingToEdit]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        locationDropdownRef.current &&
        !locationDropdownRef.current.contains(event.target)
      ) {
        setShowLocationDropdown(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const validate = useCallback(() => {
    const e = {};
    if (!formData.title.trim()) e.title = "Title is required";
    if (!formData.location) e.location = "Location is required";
    if (!formData.address.trim()) e.address = "Address is required";
    if (!formData.mainImageData) e.mainImage = "Main image is required";
    if (!formData.price || Number(formData.price) <= 0)
      e.price = "Valid price is required";
    if (!formData.about.trim()) e.about = "About is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  }, [formData]);

  const goToSlide = (newIndex) => {
    if (isAnimating) return;
    if (newIndex < 0 || newIndex >= SLIDE_LABELS.length) return;
    setDirection(newIndex > currentSlide ? 1 : -1);
    setIsAnimating(true);
    setCurrentSlide(newIndex);
    setTimeout(() => setIsAnimating(false), 320);
  };

  const handleNext = () => goToSlide(currentSlide + 1);
  const handlePrev = () => goToSlide(currentSlide - 1);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleMainImageChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      const dataURL = await readFileAsDataURL(file);
      handleInputChange("mainImageData", dataURL);
      handleInputChange("mainImageName", file.name);
    } catch (err) {
      console.error("Error reading image:", err);
    }
  };

  const handleLayoutImageChange = async (index, event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      const dataURL = await readFileAsDataURL(file);
      const next = [...formData.layoutImagesData];
      next[index] = { src: dataURL };
      handleInputChange("layoutImagesData", next);
    } catch (err) {
      console.error("Error reading image:", err);
    }
  };

  const addLayoutImageSlot = () => {
    if (formData.layoutImagesData.length >= 4) return;
    handleInputChange("layoutImagesData", [...formData.layoutImagesData, null]);
  };

  const removeLayoutImageSlot = (index) => {
    const next = formData.layoutImagesData.filter((_, i) => i !== index);
    handleInputChange("layoutImagesData", next);
  };

  const handleSubmit = () => {
    if (!validate()) return;

    const listingId = "Event" + nanoid(5, "0123456789");
    const listing = {
      id: listingId,
      location: `${formData.location}, South Africa`,
      title: formData.title.trim(),
      address: formData.address.trim(),
      image: formData.mainImageData,
      layoutimgs: formData.layoutImagesData.filter(Boolean),
      price: Number(formData.price),
      about: formData.about.trim(),
      customId: true,
    };

    if (isEditMode) {
      const idx = listings.findIndex((l) => l.id === listingToEdit.id);
      if (idx !== -1) {
        listing.id = listingToEdit.id;
        listing.customId = listingToEdit.customId || false;
        listings[idx] = listing;
      }
      saveListings(listings.filter((l) => l.customId));
    } else {
      addListing(listing);
    }

    if (isEditMode && onListingSaved) {
      onListingSaved(listing);
    } else if (!isEditMode && onListingSaved) {
      onListingSaved(listing);
    }

    onClose();
  };

  const handleRemove = () => {
    if (!listingToEdit) return;
    removeListing(listingToEdit.id);
    if (onListingRemoved) onListingRemoved(listingToEdit.id);
    onClose();
  };

  const allFieldsFilled =
    formData.title.trim() &&
    formData.location &&
    formData.address.trim() &&
    formData.mainImageData &&
    formData.price &&
    Number(formData.price) > 0 &&
    formData.about.trim();

  const renderSlideContent = () => {
    switch (currentSlide) {
      case 0:
        return (
          <div className="edit-slide-content">
            <h2 className="edit-slide-title">Listing Details</h2>
            <div className="edit-field">
              <label>Title</label>
              <input
                type="text"
                value={formData.title}
                placeholder="Add a title for your listing"
                onChange={(e) => handleInputChange("title", e.target.value)}
              />
              {errors.title && (
                <span className="edit-error">{errors.title}</span>
              )}
            </div>
            <div className="edit-field location-select-wrapper" ref={locationDropdownRef}>
              <label>Location</label>
              <div
                className="location-select"
                onClick={() => setShowLocationDropdown((prev) => !prev)}
              >
                <input
                  type="text"
                  id="location-select-input"
                  value={formData.location || ""}
                  placeholder="Select a location"
                  readOnly
                />
                <KeyboardArrowDownIcon className="location-select-icon" />
              </div>
              {showLocationDropdown && (
                <div className="location-dropdown">
                  {LOCATION_OPTIONS.map((loc) => (
                    <div
                      key={loc}
                      className="location-option"
                      onClick={() => {
                        handleInputChange("location", loc);
                        setShowLocationDropdown(false);
                      }}
                    >
                      {loc}
                    </div>
                  ))}
                </div>
              )}
              {errors.location && (
                <span className="edit-error">{errors.location}</span>
              )}
            </div>
            <div className="edit-field">
              <label>Address</label>
              <input
                type="text"
                value={formData.address}
                placeholder="Add an address"
                onChange={(e) => handleInputChange("address", e.target.value)}
              />
              {errors.address && (
                <span className="edit-error">{errors.address}</span>
              )}
            </div>
          </div>
        );
      case 1:
        return (
          <div className="edit-slide-content">
            <h2 className="edit-slide-title">Photos</h2>
            <div className="edit-field">
              <label>Main Image</label>
              <div className="edit-image-upload">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleMainImageChange}
                  className="edit-file-input"
                />
                {formData.mainImageData ? (
                  <img
                    src={formData.mainImageData}
                    alt="Main"
                    className="edit-image-preview"
                  />
                ) : (
                  <div className="edit-image-placeholder">
                    <span>+ Upload Main Image</span>
                  </div>
                )}
              </div>
              {errors.mainImage && (
                <span className="edit-error">{errors.mainImage}</span>
              )}
              {formData.mainImageName && (
                <span className="edit-file-name">{formData.mainImageName}</span>
              )}
            </div>
            <div className="edit-field">
              <label>Additional Photos (max 4)</label>
              <div className="edit-layout-images">
                {formData.layoutImagesData.map((img, index) => (
                  <div key={index} className="edit-layout-image-item">
                    <div className="edit-image-upload">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleLayoutImageChange(index, e)}
                        className="edit-file-input"
                      />
                      {img && img.src ? (
                        <img
                          src={img.src}
                          alt={`Layout ${index + 1}`}
                          className="edit-image-preview"
                        />
                      ) : (
                        <div className="edit-image-placeholder small">
                          <span>+ Image {index + 1}</span>
                        </div>
                      )}
                    </div>
                    {img && img.src && (
                      <button
                        type="button"
                        className="edit-remove-image-btn"
                        onClick={() => removeLayoutImageSlot(index)}
                      >
                        ×
                      </button>
                    )}
                  </div>
                ))}
                {formData.layoutImagesData.length < 4 && (
                  <button
                    type="button"
                    className="edit-add-image-btn"
                    onClick={addLayoutImageSlot}
                  >
                    + Add Photo
                  </button>
                )}
              </div>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="edit-slide-content">
            <h2 className="edit-slide-title">Pricing &amp; Info</h2>
            <div className="edit-field">
              <label>Price (R)</label>
              <input
                type="number"
                min="1"
                value={formData.price}
                placeholder="Price per guest"
                onChange={(e) => handleInputChange("price", e.target.value)}
              />
              {errors.price && (
                <span className="edit-error">{errors.price}</span>
              )}
            </div>
            <div className="edit-field">
              <label>About this place</label>
              <textarea
                value={formData.about}
                placeholder="What makes this place special?"
                rows="5"
                onChange={(e) => handleInputChange("about", e.target.value)}
              />
              {errors.about && (
                <span className="edit-error">{errors.about}</span>
              )}
            </div>
          </div>
        );
      case 3:
        return (
          <div className="edit-slide-content">
            <h2 className="edit-slide-title">Review Your Listing</h2>
            <div className="edit-review">
              <div className="edit-review-row">
                <strong>Title:</strong>
                <span>{formData.title}</span>
              </div>
              <div className="edit-review-row">
                <strong>Location:</strong>
                <span>{formData.location}</span>
              </div>
              <div className="edit-review-row">
                <strong>Address:</strong>
                <span>{formData.address}</span>
              </div>
              <div className="edit-review-row">
                <strong>Price:</strong>
                <span>R{formData.price}/guest</span>
              </div>
              <div className="edit-review-row">
                <strong>About:</strong>
                <span>{formData.about}</span>
              </div>
              <div className="edit-review-row">
                <strong>Main Image:</strong>
                <span>{formData.mainImageName || "Uploaded"}</span>
              </div>
              <div className="edit-review-row">
                <strong>Additional Photos:</strong>
                <span>{formData.layoutImagesData.filter(Boolean).length}</span>
              </div>
            </div>
            {!allFieldsFilled && (
              <span className="edit-error">
                Please fill out all required fields before submitting.
              </span>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="edit-modal-backdrop" onClick={onClose}>
      <div
        className="edit-modal-container"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="edit-modal-header">
          <h2>{isEditMode ? "Edit Listing" : "Add a Listing"}</h2>
          <button type="button" className="edit-close-btn" onClick={onClose}>
            <ClearOutlinedIcon />
          </button>
        </div>
        <div className="edit-slide-indicators">
          {SLIDE_LABELS.map((label, index) => (
            <button
              key={label}
              type="button"
              className={`edit-slide-dot ${
                index === currentSlide ? "active" : ""
              }`}
              onClick={() => {
                if (!isAnimating) goToSlide(index);
              }}
            >
              {label}
            </button>
          ))}
        </div>
        <div className="edit-slides-viewport">
          <div
            ref={trackRef}
            className="edit-slides-track"
            style={{
              transform: `translateX(-${currentSlide * 100}%)`,
              transition: isAnimating ? "transform 0.28s ease" : "none",
            }}
          >
            {[0, 1, 2, 3].map((index) => (
              <div
                key={index}
                className={`edit-slide ${
                  index === currentSlide ? "visible" : ""
                }`}
              >
                {renderSlideContent()}
              </div>
            ))}
          </div>
        </div>
        <div className="edit-slide-controls">
          <div className="edit-slide-arrows">
            {currentSlide > 0 && (
              <button
                type="button"
                className="edit-slide-arrow edit-prev"
                onClick={handlePrev}
              >
                <NavigateBeforeIcon />
              </button>
            )}
            {currentSlide < SLIDE_LABELS.length - 1 && (
              <button
                type="button"
                className="edit-slide-arrow edit-next"
                onClick={handleNext}
              >
                <NavigateNextIcon />
              </button>
            )}
          </div>
          <div className="edit-slide-submit">
            <button
              type="button"
              className="edit-submit-btn"
              disabled={!allFieldsFilled}
              onClick={handleSubmit}
            >
              {isEditMode ? "Save Changes" : "Submit Listing"}
            </button>
          </div>
        </div>
        {isEditMode && (
          <div className="edit-remove-section">
            <button
              type="button"
              className="edit-remove-btn"
              onClick={handleRemove}
            >
              Remove Listing
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
