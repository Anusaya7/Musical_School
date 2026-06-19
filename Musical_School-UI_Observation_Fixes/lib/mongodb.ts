import { MongoClient } from "mongodb"

const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/musical_school"
const options = {
  serverSelectionTimeoutMS: 2000,
  connectTimeoutMS: 2000,
}

let client: MongoClient
let clientPromise: Promise<MongoClient>

if (process.env.NODE_ENV === "development") {
  let globalWithMongo = global as typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>
  }

  if (!globalWithMongo._mongoClientPromise) {
    client = new MongoClient(uri, options)
    globalWithMongo._mongoClientPromise = client.connect().catch((err) => {
      console.warn("MongoDB Client Promise connection failed:", err.message)
      return client
    })
  }
  clientPromise = globalWithMongo._mongoClientPromise
} else {
  client = new MongoClient(uri, options)
  clientPromise = client.connect().catch((err) => {
    console.warn("MongoDB Client Promise connection failed:", err.message)
    return client
  })
}

export default clientPromise

