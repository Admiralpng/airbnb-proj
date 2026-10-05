import React, { useState, useEffect, useRef, useCallback } from "react";
import "./UpdateListings.css";
import { api, imageUrl } from "../../API";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import ClearOutlinedIcon from "@mui/icons-material/ClearOutlined";

const SLIDE_LABELS = ["Details", "Photos", "Pricing", "Review"];

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
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const trackRef = useRef(null);

  const [formData, setFormData] = useState({
    title: "",
    location: "",
    address: "",
    price: "",
    about: "",
    mainImageFile: null,
    mainImagePreview: null,
    mainImageName: "",
    layoutSlots: [],
  });
  const [removedLayouts, setRemovedLayouts] = useState([]);

  const [errors, setErrors] = useState({});
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const locationDropdownRef = useRef(null);

  const LOCATION_OPTIONS = ["Johannesburg", "Cape Town"];

  const isEditMode = !!listingToEdit;

  useEffect(() => {
    if (!isOpen) return;

    setRemovedLayouts([]);
    setSubmitError(null);
    setCurrentSlide(0);
    setDirection(0);
    setErrors({});

    if (listingToEdit) {
      setFormData({
        title: listingToEdit.title || "",
        location:
          listingToEdit.location?.replace(", South Africa", "") || "",
        address: listingToEdit.address || "",
        price: listingToEdit.price?.toString() || "",
        about: listingToEdit.about || "",
        mainImageFile: null,
        mainImagePreview: imageUrl(listingToEdit.image) || null,
        mainImageName: "",
        layoutSlots: (listingToEdit.layoutimgs || []).map((filename) => ({
          existing: filename,
          file: null,
          preview: imageUrl(filename),
        })),
      });
    } else {
      setFormData({
        title: "",
        location: "",
        address: "",
        price: "",
        about: "",
        mainImageFile: null,
        mainImagePreview: null,
        mainImageName: "",
        layoutSlots: [],
      });
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
    if (!formData.mainImagePreview) e.mainImage = "Main image is required";
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

  const handleMainImageChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setFormData((prev) => ({
      ...prev,
      mainImageFile: file,
      mainImagePreview: URL.createObjectURL(file),
      mainImageName: file.name,
    }));
    setErrors((prev) => ({ ...prev, mainImage: undefined }));
  };

  const handleLayoutImageChange = (index, event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const next = [...formData.layoutSlots];
    next[index] = { file, preview: URL.createObjectURL(file) };
    handleInputChange("layoutSlots", next);
  };

  const addLayoutImageSlot = () => {
    if (formData.layoutSlots.length >= 4) return;
    handleInputChange("layoutSlots", [...formData.layoutSlots, null]);
  };

  const removeLayoutImageSlot = (index) => {
    const slot = formData.layoutSlots[index];
    if (slot?.existing) {
      setRemovedLayouts((prev) => [...prev, slot.existing]);
    }
    handleInputChange(
      "layoutSlots",
      formData.layoutSlots.filter((_, i) => i !== index),
    );
  };

  const buildFormData = () => {
    const data = new FormData();
    data.append("title", formData.title.trim());
    data.append("location", `${formData.location}, South Africa`);
    data.append("address", formData.address.trim());
    data.append("about", formData.about.trim());
    data.append("price", String(Number(formData.price)));

    if (formData.mainImageFile) {
      data.append("image", formData.mainImageFile);
    }

    formData.layoutSlots.forEach((slot) => {
      if (slot?.file) {
        data.append("layoutimgs", slot.file);
      }
    });

    if (removedLayouts.length) {
      data.append("removedLayoutimgs", removedLayouts.join(","));
    }

    return data;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    if (!isEditMode && !formData.mainImageFile) {
      setErrors({ mainImage: "Main image is required" });
      return;
    }

    setSubmitting(true);
    setSubmitError(null);

    try {
      const payload = buildFormData();
      const { listing } = isEditMode
        ? await api.upload(`/listings/${listingToEdit._id}`, payload, "PATCH")
        : await api.upload("/listings", payload, "POST");

      if (onListingSaved) {
        onListingSaved(listing);
      }

      onClose();
    } catch (err) {
      setSubmitError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleRemove = async () => {
    if (!listingToEdit) return;

    setSubmitting(true);
    setSubmitError(null);

    try {
      await api.delete(`/listings/${listingToEdit._id}`);
      if (onListingRemoved) {
        onListingRemoved(listingToEdit._id);
      }
      onClose();
    } catch (err) {
      setSubmitError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const allFieldsFilled =
    formData.title.trim() &&
    formData.location &&
    formData.address.trim() &&
    formData.mainImagePreview &&
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
                onChange={(event) => handleInputChange("title", event.target.value)}
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
                onChange={(event) => handleInputChange("address", event.target.value)}
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
                {formData.mainImagePreview ? (
                  <img
                    src={formData.mainImagePreview}
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
                {formData.layoutSlots.map((slot, index) => (
                  <div key={index} className="edit-layout-image-item">
                    <div className="edit-image-upload">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(event) => handleLayoutImageChange(index, event)}
                        className="edit-file-input"
                      />
                      {slot && slot.preview ? (
                        <img
                          src={slot.preview}
                          alt={`Layout ${index + 1}`}
                          className="edit-image-preview"
                        />
                      ) : (
                        <div className="edit-image-placeholder small">
                          <span>+ Image {index + 1}</span>
                        </div>
                      )}
                    </div>
                    {slot && slot.preview && (
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
                {formData.layoutSlots.length < 4 && (
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
                onChange={(event) => handleInputChange("price", event.target.value)}
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
                onChange={(event) => handleInputChange("about", event.target.value)}
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
                <span>{formData.layoutSlots.filter(Boolean).length}</span>
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
              disabled={!allFieldsFilled || submitting}
              onClick={handleSubmit}
            >
              {submitting
                ? "Saving..."
                : isEditMode
                  ? "Save Changes"
                  : "Submit Listing"}
            </button>
          </div>
        </div>
        {submitError && <span className="edit-error">{submitError}</span>}
        {isEditMode && (
          <div className="edit-remove-section">
            <button
              type="button"
              className="edit-remove-btn"
              disabled={submitting}
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
