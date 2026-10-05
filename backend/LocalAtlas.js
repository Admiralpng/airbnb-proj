require("dotenv").config();

const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const { seed } = require("./seed");

async function main() {
  const memoryServer = await MongoMemoryServer.create();
  const uri = memoryServer.getUri();
  console.log(`Using in-memory MongoDB at ${uri}`);

  await mongoose.connect(uri);
  await seed();

  process.env.MONGODB_URI = uri;
  require("./server");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});