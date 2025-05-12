let prefixAdapter, emojiAdapter;
switch (process.env.DB_TYPE) {
  case 'postgres':
    prefixAdapter = await import('./postgres/prefix.js');
    emojiAdapter = await import('./postgres/emoji.js');
    break;
  case 'mongo':
    prefixAdapter = await import('./mongo/prefix.js');
    emojiAdapter = await import('./mongo/emoji.js');
    break;
  case 'sqlite':
    prefixAdapter = await import('./sqlite/prefix.js');
    emojiAdapter = await import('./sqlite/emoji.js');
    break;
  case 'mysql':
    prefixAdapter = await import('./mysql/prefix.js');
    emojiAdapter = await import('./mysql/emoji.js');
    break;
  case 'mariadb':
  default:
    prefixAdapter = await import('./mariadb/prefix.js');
    emojiAdapter = await import('./mariadb/emoji.js');
    break;
}
export const { getPrefix, setPrefix } = prefixAdapter;
export const { areEmojisAdded, setEmojisAdded } = emojiAdapter; 