require("dotenv").config();

const { connect, disconnect } = require("./db/mongo");
const seedListings = require("./seedListings");

const force = process.argv.includes("--force");

async function seed() {
  const db = await connect();

  if (force) {
    const { deletedCount } = await db
      .collection("listings")
      .deleteMany({ owner: null });
    console.log(`Removed ${deletedCount} previously seeded listings`);
  }

  const count = await db.collection("listings").countDocuments({ owner: null });

  if (count > 0) {
    console.log(
      `Seeded listings already present (${count}), skipping. Re-run with --force to refresh.`,
    );
    return { inserted: 0, skipped: true };
  }

  const now = new Date();
  await db.collection("listings").insertMany(
    seedListings.map((listing) => ({
      ...listing,
      owner: null,
      createdAt: now,
      updatedAt: now,
    })),
  );
  console.log(`Seeded ${seedListings.length} listings`);
  return { inserted: seedListings.length, skipped: false };
}

async function connectAndSeed() {
  console.log("Connected to MongoDB");
  await seed();
  await disconnect();
}

if (require.main === module) {
  connectAndSeed().catch((error) => {
    console.error("Seed failed:", error.message);
    process.exit(1);
  });
}

module.exports = { seed, connect };