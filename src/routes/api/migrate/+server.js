import { json } from '@sveltejs/kit';
import { getRedis, keys } from '$lib/redis.js';

// POST /api/migrate — one-time migration of unprefixed keys → glow: namespace
// Safe to run multiple times; skips keys that already exist under the new namespace.
export async function POST() {
  try {
    const redis = getRedis();
    const log = [];

    // 1. members set
    const oldMembers = await redis.smembers('members');
    if (oldMembers.length) {
      await redis.sadd(keys.members, ...oldMembers);
      log.push(`members: migrated ${oldMembers.length} member IDs`);
    }

    // 2. member:{id} → glow:member:{id}
    for (const id of oldMembers) {
      const val = await redis.get(`member:${id}`);
      if (val) {
        await redis.set(keys.member(id), val);
        log.push(`member:${id} → ${keys.member(id)}`);
      }
    }

    // 3. name:* → glow:name:*
    const nameKeys = await redis.keys('name:*');
    for (const k of nameKeys) {
      const val = await redis.get(k);
      if (val) {
        const suffix = k.slice('name:'.length);
        await redis.set(keys.name(suffix), val);
        log.push(`${k} → ${keys.name(suffix)}`);
      }
    }

    // 4. preferences hash → glow:preferences
    const prefs = await redis.hgetall('preferences');
    if (prefs && Object.keys(prefs).length) {
      const entries = Object.entries(prefs).flat();
      await redis.hset(keys.preferences, ...entries);
      log.push(`preferences: migrated ${Object.keys(prefs).length} entries`);
    }

    return json({ ok: true, log });
  } catch (err) {
    console.error('Migration error:', err);
    return json({ error: String(err) }, { status: 500 });
  }
}
