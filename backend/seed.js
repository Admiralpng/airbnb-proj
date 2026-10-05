require("dotenv").config();

const mongoose = require("mongoose");
const Listing = require("./models/Listing");
const seedListings = require("./seedListings");

const force = process.argv.includes("--force");

async function seed() {
  if (force) {
    const { deletedCount } = await Listing.deleteMany({ owner: null });
    console.log(`Removed ${deletedCount} previously seeded listings`);
  }

  const count = await Listing.countDocuments({ owner: null });

  if (count > 0) {
    console.log(
      `Seeded listings already present (${count}), skipping. Re-run with --force to refresh.`,
    );
    return { inserted: 0, skipped: true };
  }

  await Listing.insertMany(
    seedListings.map((listing) => ({ ...listing, owner: null })),
  );
  console.log(`Seeded ${seedListings.length} listings`);
  return { inserted: seedListings.length, skipped: false };
}

async function connect() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log("Connected to MongoDB");
  await seed();
  await mongoose.disconnect();
}

if (require.main === module) {
  connect().catch((error) => {
    console.error("Seed failed:", error.message);
    process.exit(1);
  });
}

module.exports = { seed, connect };