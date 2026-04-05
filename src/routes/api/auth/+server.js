import { json } from '@sveltejs/kit';
import { getDb } from '$lib/db.js';
import bcrypt from 'bcryptjs';

// POST /api/auth — log in with name + PIN
export async function POST({ request }) {
  const { name, pin } = await request.json();

  if (!name?.trim() || !pin) {
    return json({ error: 'Name and PIN required.' }, { status: 400 });
  }

  try {
    const db = await getDb();
    const member = await db.collection('members').findOne({
      name: { $regex: new RegExp(`^${name.trim()}$`, 'i') }
    });

    if (!member) {
      return json({ error: 'No account found with that name.' }, { status: 404 });
    }

    const valid = await bcrypt.compare(pin, member.pinHash);
    if (!valid) {
      return json({ error: 'Incorrect PIN.' }, { status: 401 });
    }

    return json({ _id: member._id.toString(), name: member.name });
  } catch (err) {
    console.error('Auth error:', err);
    return json({ error: 'Server error. Please try again.' }, { status: 500 });
  }
}
