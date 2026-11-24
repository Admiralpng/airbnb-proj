require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");

const authRoutes = require("./routes/auth");
const listingRoutes = require("./routes/listings");
const bookingRoutes = require("./routes/bookings");
const { connect } = require("./db/mongo");

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN || true,
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  "/uploads",
  express.static(path.join(__dirname, "uploads"), { fallthrough: true }),
);

let connected;

const connectDb = async () => {
  if (connected) return connected;
  connected = connect();
  await connected;
  return connected;
};

app.use(async (req, res, next) => {
  try {
    await connectDb();
    next();
  } catch (error) {
    next(error);
  }
});

app.use("/api/auth", authRoutes);
app.use("/api/listings", listingRoutes);
app.use("/api/bookings", bookingRoutes);

app.get("/api/health", (req, res) => res.json({ ok: true }));

app.use((req, res) => res.status(404).json({ error: "Route not found" }));

app.use((error, req, res, next) => {
  if (res.headersSent) return next(error);
  const status = error.status || (error.name === "MulterError" ? 400 : 500);
  if (status >= 500) console.error(error);
  return res
    .status(status)
    .json({ error: error.message || "Something went wrong" });
});

if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  connectDb()
    .then(() => {
      app.listen(PORT, () => {
        console.log(`API listening on http://localhost:${PORT}`);
      });
    })
    .catch((error) => {
      console.error("MongoDB connection failed:", error.message);
      process.exit(1);
    });
}

module.exports = app;