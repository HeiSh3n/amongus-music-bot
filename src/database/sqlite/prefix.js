import db from './pool.js';

await db.exec(`
  CREATE TABLE IF NOT EXISTS guild_prefixes (
    guild_id TEXT PRIMARY KEY,
    prefix TEXT NOT NULL
  )
`);

export async function getPrefix(guildId) {
  const row = await db.get('SELECT prefix FROM guild_prefixes WHERE guild_id = ?', guildId);
  return row?.prefix || null;
}

export async function setPrefix(guildId, prefix) {
  await db.run(
    'INSERT INTO guild_prefixes (guild_id, prefix) VALUES (?, ?) ON CONFLICT(guild_id) DO UPDATE SET prefix = excluded.prefix',
    guildId, prefix
  );
} 