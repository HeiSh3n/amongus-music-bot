import 'dotenv/config';

// Database adapter pattern for emoji management
const dbType = process.env.DB_TYPE || 'mariadb';
let adapter;

switch (dbType) {
  case 'mariadb':
    adapter = await import('./emojiDatabase.mariadb.js');
    break;
  // case 'postgres':
  //   adapter = await import('./emojiDatabase.postgres.js');
  //   break;
  // case 'mongo':
  //   adapter = await import('./emojiDatabase.mongo.js');
  //   break;
  default:
    throw new Error(`Unsupported DB_TYPE '${dbType}'. Please provide a compatible adapter in src/services/emojiDatabase.${dbType}.js`);
}

export const areEmojisAdded = adapter.areEmojisAdded;
export const setEmojisAdded = adapter.setEmojisAdded;
export const pool = adapter.pool; 
