import client from './client.js';

const db = client.db(process.env.DB_NAME || 'amongus');
const prefixCol = db.collection('guild_prefixes');

// Collection/index creation logic (run on module load)
async function ensurePrefixCollection() {
  try {
    await prefixCol.createIndex({ guild_id: 1 }, { unique: true });
  } catch (err) {
    console.error('MongoDB error in ensurePrefixCollection:', err);
  }
}
if (db) ensurePrefixCollection();

export async function getPrefix(guildId) {
  const doc = await prefixCol.findOne({ guild_id: guildId });
  return doc?.prefix || null;
}

export async function setPrefix(guildId, prefix) {
  await prefixCol.updateOne(
    { guild_id: guildId },
    { $set: { prefix } },
    { upsert: true }
  );
} 