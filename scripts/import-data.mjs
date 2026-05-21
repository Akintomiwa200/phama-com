import { MongoClient } from "mongodb";
import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

const uri = process.env.MONGODB_URI;
if (!uri) {
  console.error("MONGODB_URI not found in .env");
  process.exit(1);
}

const dataDir = resolve(__dirname, "..", "data");

const collections = [
  { file: "drugs.json", name: "drugs" },
  { file: "patients.json", name: "patients" },
  { file: "pharmacists.json", name: "pharmacists" },
  { file: "interactions.json", name: "interactions" },
  { file: "cascade-patterns.json", name: "cascadePatterns" },
  { file: "audit-log.json", name: "auditLog" },
];

const client = new MongoClient(uri);

try {
  await client.connect();
  console.log("Connected to MongoDB");

  const db = client.db("pharmacy");

  for (const { file, name } of collections) {
    const filePath = resolve(dataDir, file);
    const raw = readFileSync(filePath, "utf-8");
    let data = JSON.parse(raw);

    if (name === "auditLog") {
      data = data.entries;
    }

    if (!Array.isArray(data)) {
      console.warn(`Skipping ${file}: not an array`);
      continue;
    }

    const result = await db.collection(name).insertMany(data);
    console.log(`Inserted ${result.insertedCount} documents into '${name}' collection`);
  }

  console.log("All data imported successfully");
} catch (err) {
  console.error("Error:", err.message);
  process.exit(1);
} finally {
  await client.close();
}
