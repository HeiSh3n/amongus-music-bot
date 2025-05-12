import pool from './mariadbPool.js';

// Ensure the guild_prefixes table exists on module load
async function ensurePrefixTable() {
  let conn;
  try {
    conn = await pool.getConnection();
    await conn.query(`
      CREATE TABLE IF NOT EXISTS guild_prefixes (
        guild_id VARCHAR(32) PRIMARY KEY,
        prefix VARCHAR(10) NOT NULL
      )
    `);
  } catch (err) {
    console.error('DB error in ensurePrefixTable:', err);
  } finally {
    if (conn) conn.release();
  }
}
ensurePrefixTable();

export async function getPrefix(guildId) {
  let conn;
  try {
    conn = await pool.getConnection();
    // Fetch the custom prefix for the guild, or return default if not set
    const rows = await conn.query('SELECT prefix FROM guild_prefixes WHERE guild_id = ?', [guildId]);
    return rows[0]?.prefix || '.';
  } finally {
    if (conn) conn.release();
  }
}

export async function setPrefix(guildId, prefix) {
  let conn;
  try {
    conn = await pool.getConnection();
    // Upsert the prefix for the guild
    await conn.query(
      'INSERT INTO guild_prefixes (guild_id, prefix) VALUES (?, ?) ON DUPLICATE KEY UPDATE prefix = VALUES(prefix)',
      [guildId, prefix]
    );
  } finally {
    if (conn) conn.release();
  }
}

export { pool }; 
