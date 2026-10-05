const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const crypto = require("crypto");
const Listing = require("../models/Listing");
const { requireAuth, requireListingOwner } = require("../middleware/auth");

const router = express.Router();

const uploadsDir = path.join(__dirname, "..", "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname) || ".jpg";
    cb(null, `${Date.now()}-${crypto.randomBytes(6).toString("hex")}${ext}`);
  },
});

const imageOnly = (req, file, cb) => {
  if (/^image\/(jpe?g|png|webp|gif|avif)$/.test(file.mimetype)) {
    return cb(null, true);
  }
  return cb(new Error("Only image uploads are allowed"));
};

const uploadFields = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024, files: 5 },
  fileFilter: imageOnly,
}).any();

const LAYOUT_FIELDS = new Set(["layoutimgs", "layoutimgs[]"]);

const collectUploads = (req) => {
  const all = Array.isArray(req.files) ? req.files : [];
  const main = all.filter((file) => file.fieldname === "image");
  const layouts = all.filter((file) => LAYOUT_FIELDS.has(file.fieldname));

  if (main.length > 1 || layouts.length > 4) {
    const error = new Error("Too many images uploaded");
    error.status = 400;
    throw error;
  }

  return { main: main[0], layouts };
};

const removeFile = (filename) => {
  if (!filename) return;
  const target = path.join(uploadsDir, path.basename(filename));
  fs.promises.unlink(target).catch(() => {});
};

const parseArray = (value) => {
  if (Array.isArray(value)) return value.filter(Boolean);
  if (typeof value === "string" && value.length) {
    return value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }
  return [];
};

const isValidId = (id) => /^[a-fA-F0-9]{24}$/.test(id);

const loadListing = async (req, res, next) => {
  try {
    if (!isValidId(req.params.id)) {
      return res.status(404).json({ error: "Listing not found" });
    }

    const listing = await Listing.findById(req.params.id);
    if (!listing) {
      return res.status(404).json({ error: "Listing not found" });
    }

    req.listing = listing;
    return next();
  } catch (error) {
    return next(error);
  }
};

router.get("/", async (req, res, next) => {
  try {
    const listings = await Listing.find().sort({ createdAt: 1 });
    return res.json({ listings });
  } catch (error) {
    return next(error);
  }
});

router.get("/:id", loadListing, (req, res) =>
  res.json({ listing: req.listing }),
);

router.post("/", requireAuth, uploadFields, async (req, res, next) => {
  let uploads;
  try {
    uploads = collectUploads(req);
  } catch (error) {
    return next(error);
  }

  const { main: uploadedMain, layouts: uploadedLayouts } = uploads;

  const cleanupUploads = () => {
    removeFile(uploadedMain?.filename);
    uploadedLayouts.forEach((file) => removeFile(file.filename));
  };

  try {
    const title = String(req.body.title || "").trim();
    const location = String(req.body.location || "").trim();
    const address = String(req.body.address || "").trim();
    const about = String(req.body.about || "").trim();
    const price = Number(req.body.price);

    if (!title || !location) {
      cleanupUploads();
      return res.status(400).json({ error: "Title and location required" });
    }
    if (!Number.isFinite(price) || price <= 0) {
      cleanupUploads();
      return res.status(400).json({ error: "A valid price is required" });
    }
    if (!uploadedMain) {
      cleanupUploads();
      return res.status(400).json({ error: "A main image is required" });
    }

    const listing = await Listing.create({
      title,
      location,
      address,
      about,
      price,
      rating: Number(req.body.rating) || 0,
      image: uploadedMain.filename,
      layoutimgs: uploadedLayouts.map((file) => file.filename),
      owner: req.user._id,
    });

    return res.status(201).json({ listing });
  } catch (error) {
    cleanupUploads();
    return next(error);
  }
});

router.patch(
  "/:id",
  requireAuth,
  loadListing,
  requireListingOwner,
  uploadFields,
  async (req, res, next) => {
    try {
      const listing = req.listing;
      let uploads;
    try {
      uploads = collectUploads(req);
    } catch (error) {
      return next(error);
    }

    const { main: uploadedMain, layouts: uploadedLayouts } = uploads;
    const removedLayouts = parseArray(req.body.removedLayoutimgs);

      if (req.body.title !== undefined) {
        const title = String(req.body.title).trim();
        if (!title) {
          return res.status(400).json({ error: "Title cannot be empty" });
        }
        listing.title = title;
      }

      if (req.body.location !== undefined) {
        const location = String(req.body.location).trim();
        if (!location) {
          return res.status(400).json({ error: "Location cannot be empty" });
        }
        listing.location = location;
      }

      if (req.body.address !== undefined) {
        listing.address = String(req.body.address).trim();
      }

      if (req.body.about !== undefined) {
        listing.about = String(req.body.about).trim();
      }

      if (req.body.price !== undefined) {
        const price = Number(req.body.price);
        if (!Number.isFinite(price) || price <= 0) {
          return res.status(400).json({ error: "A valid price is required" });
        }
        listing.price = price;
      }

      if (uploadedMain) {
        removeFile(listing.image);
        listing.image = uploadedMain.filename;
      }

      if (uploadedLayouts.length || removedLayouts.length) {
        const kept = listing.layoutimgs.filter(
          (file) => !removedLayouts.includes(file),
        );
        removedLayouts.forEach((file) => removeFile(file));
        listing.layoutimgs = [
          ...kept,
          ...uploadedLayouts.map((file) => file.filename),
        ];
      }

      await listing.save();
      return res.json({ listing });
    } catch (error) {
      return next(error);
    }
  },
);

router.delete(
  "/:id",
  requireAuth,
  loadListing,
  requireListingOwner,
  async (req, res, next) => {
    try {
      const listing = req.listing;
      removeFile(listing.image);
      listing.layoutimgs.forEach((file) => removeFile(file));
      await Listing.deleteOne({ _id: listing._id });
      return res.json({ deleted: true, id: listing._id });
    } catch (error) {
      return next(error);
    }
  },
);

module.exports = router;