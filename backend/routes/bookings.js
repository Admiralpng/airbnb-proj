const express = require("express");
const Booking = require("../models/Booking");
const Listing = require("../models/Listing");
const { requireAuth } = require("../middleware/auth");

const router = express.Router();

const MS_PER_DAY = 86400000;
const isValidId = (id) => /^[a-fA-F0-9]{24}$/.test(id);

const startOfToday = () => {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
};

const parseDateOnly = (value) => {
  if (!value || typeof value !== "string") return null;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value.trim())) return null;
  const [year, month, day] = value.trim().split("-").map(Number);
  const date = new Date(year, month - 1, day);
  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return null;
  }
  return date;
};

router.get("/", requireAuth, async (req, res, next) => {
  try {
    const bookings = await Booking.find({ user: req.user._id }).sort({
      createdAt: -1,
    });
    return res.json({ bookings });
  } catch (error) {
    return next(error);
  }
});

router.post("/", requireAuth, async (req, res, next) => {
  try {
    const guests = Number(req.body.guests);
    if (!Number.isInteger(guests) || guests < 1 || guests > 20) {
      return res.status(400).json({ error: "Guests must be a whole number from 1 to 20" });
    }

    const checkIn = parseDateOnly(req.body.checkIn);
    const checkOut = parseDateOnly(req.body.checkOut);

    if (!checkIn || !checkOut) {
      return res
        .status(400)
        .json({ error: "checkIn and checkOut must be YYYY-MM-DD dates" });
    }
    if (checkOut <= checkIn) {
      return res
        .status(400)
        .json({ error: "checkOut must be after checkIn" });
    }
    if (checkIn < startOfToday()) {
      return res.status(400).json({ error: "checkIn cannot be in the past" });
    }

    const listingId = req.body.listingId;
    if (!isValidId(listingId)) {
      return res.status(404).json({ error: "Listing not found" });
    }

    const listing = await Listing.findById(listingId);
    if (!listing) {
      return res.status(404).json({ error: "Listing not found" });
    }

    const clash = await Booking.findOne({
      listing: listing._id,
      checkIn: { $lt: checkOut },
      checkOut: { $gt: checkIn },
    });
    if (clash) {
      return res.status(409).json({ error: "Dates already booked" });
    }

    const nights = Math.round((checkOut - checkIn) / MS_PER_DAY);
    const total = Number(listing.price) * nights * guests;

    const booking = await Booking.create({
      user: req.user._id,
      listing: listing._id,
      title: listing.title,
      location: listing.location,
      image: listing.image,
      price: listing.price,
      guests,
      checkIn,
      checkOut,
      nights,
      total,
    });

    return res.status(201).json({ booking });
  } catch (error) {
    return next(error);
  }
});

router.delete("/:id", requireAuth, async (req, res, next) => {
  try {
    if (!isValidId(req.params.id)) {
      return res.status(404).json({ error: "Booking not found" });
    }

    const result = await Booking.deleteOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: "Booking not found" });
    }

    return res.json({ deleted: true, id: req.params.id });
  } catch (error) {
    return next(error);
  }
});

module.exports = router;