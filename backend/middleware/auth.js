const jwt = require("jsonwebtoken");
const User = require("../models/User");

const requireAuth = async (req, res, next) => {
  try {
    const header = req.headers.authorization || "";
    const [scheme, token] = header.split(" ");

    if (scheme !== "Bearer" || !token) {
      return res.status(401).json({ error: "Authentication required" });
    }

    let payload;
    try {
      payload = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      return res.status(401).json({ error: "Invalid or expired token" });
    }

    const user = await User.findById(payload.sub);
    if (!user) {
      return res.status(401).json({ error: "User no longer exists" });
    }

    req.user = user;
    req.token = token;
    return next();
  } catch (error) {
    return res.status(401).json({ error: "Authentication required" });
  }
};

const requireListingOwner = (req, res, next) => {
  const owner = req.listing?.owner;
  const ownerId = owner ? owner.toString() : null;

  if (!ownerId || ownerId !== req.user._id.toString()) {
    return res.status(403).json({ error: "You do not own this listing" });
  }

  return next();
};

module.exports = { requireAuth, requireListingOwner };