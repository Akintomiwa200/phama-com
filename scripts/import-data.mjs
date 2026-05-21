import { MongoClient } from "mongodb";
import { createInterface } from "readline";

const uri = process.env.MONGODB_URI;

if (!uri) {
  console.error("MONGODB_URI not set. Use --env-file=.env");
  process.exit(1);
}

const client = new MongoClient(uri);

try {
  await client.connect();
  console.log("Connected to MongoDB\n");

  const rl = createInterface({ input: process.stdin, output: process.stdout });
  const answer = await new Promise(resolve => {
    rl.question("This will REPLACE all existing data. Continue? (y/N) ", resolve);
  });
  rl.close();

  if (answer.toLowerCase() !== "y") {
    console.log("Cancelled");
    process.exit(0);
  }

  const db = client.db("pharmacy");

  // Import from the app's seed API
  const seedRes = await fetch("http://localhost:3000/api/seed", { method: "POST" });
  if (!seedRes.ok) {
    const err = await seedRes.text();
    console.error(`Seed API failed: ${err}`);
    console.log("Make sure the dev server is running on port 3000");
    process.exit(1);
  }

  const result = await seedRes.json();
  console.log("\nSeeded collections:", result.collections.join(", "));
  console.log("All data imported successfully from app data");
} catch (err) {
  console.error("Error:", err.message);
  process.exit(1);
} finally {
  await client.close();
}
