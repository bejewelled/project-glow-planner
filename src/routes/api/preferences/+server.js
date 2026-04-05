import { json } from '@sveltejs/kit';
import { getDb } from '$lib/db.js';
import { ObjectId } from 'mongodb';

// GET /api/preferences — return all preferences as { artistKey: [{ name, priority }] }
export async function GET() {
  const db = await getDb();
  const prefs = await db.collection('preferences').find({}).toArray();
  const members = await db.collection('members').find({}).toArray();

  const memberMap = Object.fromEntries(members.map((m) => [m._id.toString(), m.name]));

  /** @type {Record<string, Array<{memberId: string, name: string, priority: number}>>} */
  const result = {};
  for (const pref of prefs) {
    const key = pref.artistKey;
    if (!result[key]) result[key] = [];
    result[key].push({
      memberId: pref.memberId.toString(),
      name: memberMap[pref.memberId.toString()] ?? 'Unknown',
      priority: pref.priority
    });
  }

  // Sort each artist's list by priority ascending, then name
  for (const key of Object.keys(result)) {
    result[key].sort((a, b) => a.priority - b.priority || a.name.localeCompare(b.name));
  }

  return json(result);
}

// PUT /api/preferences — set or update a preference
export async function PUT({ request }) {
  const { memberId, artistKey, priority } = await request.json();

  if (!memberId || !artistKey || ![1, 2, 3, 4].includes(priority)) {
    return json({ error: 'memberId, artistKey, and priority (1–3) required.' }, { status: 400 });
  }

  const db = await getDb();
  await db.collection('preferences').updateOne(
    { memberId: new ObjectId(memberId), artistKey },
    { $set: { priority } },
    { upsert: true }
  );

  return json({ ok: true });
}

// DELETE /api/preferences — remove a preference
export async function DELETE({ request }) {
  const { memberId, artistKey } = await request.json();

  if (!memberId || !artistKey) {
    return json({ error: 'memberId and artistKey required.' }, { status: 400 });
  }

  const db = await getDb();
  await db.collection('preferences').deleteOne({
    memberId: new ObjectId(memberId),
    artistKey
  });

  return json({ ok: true });
}
