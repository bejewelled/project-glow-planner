import { json } from '@sveltejs/kit';
import { getDb } from '$lib/db.js';
import bcrypt from 'bcryptjs';

// POST /api/members — register a new member
export async function POST({ request }) {
  const { name, pin } = await request.json();

  if (!name?.trim() || !/^\d{4}$/.test(pin)) {
    return json({ error: 'Name and 4-digit PIN required.' }, { status: 400 });
  }

  const db = await getDb();
  const existing = await db.collection('members').findOne({
    name: { $regex: new RegExp(`^${name.trim()}$`, 'i') }
  });

  if (existing) {
    return json({ error: 'That name is already taken.' }, { status: 409 });
  }

  const pinHash = await bcrypt.hash(pin, 10);
  const result = await db.collection('members').insertOne({
    name: name.trim(),
    pinHash
  });

  return json({ _id: result.insertedId.toString(), name: name.trim() }, { status: 201 });
}
