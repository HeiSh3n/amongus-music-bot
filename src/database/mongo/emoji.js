import client from './client.js';

const db = client.db(process.env.DB_NAME || 'amongus');
const emojiCol = db.collection('guild_emojis');

// Collection/index creation logic (run on module load)
async function ensureEmojiCollection() {
  try {
    await emojiCol.createIndex({ guild_id: 1 }, { unique: true });
  } catch (err) {
    console.error('MongoDB error in ensureEmojiCollection:', err);
  }
}
if (db) ensureEmojiCollection();

export async function areEmojisAdded(guildId) {
  const doc = await emojiCol.findOne({ guild_id: guildId });
  if (!doc) return false;
  return doc.spotify_emoji_added && doc.youtube_emoji_added && doc.netease_emoji_added;
}

export async function setEmojisAdded(guildId, spotify, youtube, netease) {
  await emojiCol.updateOne(
    { guild_id: guildId },
    { $set: {
      spotify_emoji_added: !!spotify,
      youtube_emoji_added: !!youtube,
      netease_emoji_added: !!netease
    } },
    { upsert: true }
  );
} 