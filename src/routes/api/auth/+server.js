import { json } from '@sveltejs/kit';
import { getDb } from '$lib/db.js';
import bcrypt from 'bcryptjs';

// POST /api/auth — log in with name + PIN
export async function POST({ request }) {
  const { name, pin } = await request.json();

  if (!name?.trim() || !pin) {
    return json({ error: 'Name and PIN required.' }, { status: 400 });
  }

  const db = await getDb();
  const member = await db.collection('members').findOne({
    name: { $regex: new RegExp(`^${name.trim()}$`, 'i') }
  });

  if (!member) {
    return json({ error: 'Member not found.' }, { status: 404 });
  }

  const valid = await bcrypt.compare(pin, member.pinHash);
  if (!valid) {
    return json({ error: 'Incorrect PIN.' }, { status: 401 });
  }

  return json({ _id: member._id.toString(), name: member.name });
}
