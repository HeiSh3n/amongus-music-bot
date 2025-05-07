import 'dotenv/config';

// context7: Database adapter pattern for multi-DB support
const dbType = process.env.DB_TYPE || 'mariadb';
let adapter;

switch (dbType) {
  case 'mariadb':
    adapter = await import('./prefixDatabase.mariadb.js');
    break;
  // case 'postgres':
  //   adapter = await import('./prefixDatabase.postgres.js');
  //   break;
  // case 'mongo':
  //   adapter = await import('./prefixDatabase.mongo.js');
  //   break;
  default:
    throw new Error(`context7: Unsupported DB_TYPE '${dbType}'. Please provide a compatible adapter in src/services/prefixDatabase.${dbType}.js`);
}

export const getPrefix = adapter.getPrefix;
export const setPrefix = adapter.setPrefix;
// Optionally export pool/connection for health checks, etc.
export const pool = adapter.pool;

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