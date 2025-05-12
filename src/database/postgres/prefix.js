import pool from './pool.js';

// Table creation logic (run on module load)
async function ensurePrefixTable() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS guild_prefixes (
        guild_id VARCHAR(32) PRIMARY KEY,
        prefix VARCHAR(10) NOT NULL
      )
    `);
  } catch (err) {
    console.error('DB error in ensurePrefixTable:', err);
  }
}
if (pool) ensurePrefixTable();

export async function getPrefix(guildId) {
  const res = await pool.query('SELECT prefix FROM guild_prefixes WHERE guild_id = $1', [guildId]);
  return res.rows[0]?.prefix || null;
}

export async function setPrefix(guildId, prefix) {
  await pool.query(
    'INSERT INTO guild_prefixes (guild_id, prefix) VALUES ($1, $2) ON CONFLICT (guild_id) DO UPDATE SET prefix = EXCLUDED.prefix',
    [guildId, prefix]
  );
} 