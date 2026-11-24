const dns = require("dns");
const { MongoClient } = require("mongodb");

dns.setServers(["8.8.8.8", "1.1.1.1"]);

let client;
let db;

async function connect() {
  if (db) return db;
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("MONGODB_URI is not set");
  client = new MongoClient(uri, {
    serverSelectionTimeoutMS: 5000,
  });
  await client.connect();
  db = client.db();
  return db;
}

async function disconnect() {
  if (db) {
    await client.close();
    db = null;
    client = null;
  }
}

function getDb() {
  return db;
}

module.exports = { connect, disconnect, getDb };