import { MongoClient } from 'mongodb';
import { MONGODB_URI } from '$env/static/private';

let client;
let db;

export async function getDb() {
  if (!db) {
    client = new MongoClient(MONGODB_URI);
    await client.connect();
    db = client.db('edc2026');
  }
  return db;
}
