import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;

let clientPromise: Promise<MongoClient> | null = null;

function getClientPromise() {
  if (!uri) return null;
  if (clientPromise) return clientPromise;

  const options = {};
  if (process.env.NODE_ENV === "development") {
    const g = global as any;
    if (!g._mongoClientPromise) {
      g._mongoClientPromise = new MongoClient(uri, options).connect();
    }
    clientPromise = g._mongoClientPromise;
  } else {
    clientPromise = new MongoClient(uri, options).connect();
  }
  return clientPromise;
}

export async function getDb() {
  const p = getClientPromise();
  if (!p) throw new Error("MONGODB_URI not configured");
  const c = await p;
  return c.db("pharmacy");
}

export function isMongoConfigured() {
  return !!uri;
}
