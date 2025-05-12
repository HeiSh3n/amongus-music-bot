import printCommandTable from '../startup/printCommandTable.js';
import announceStartup from '../startup/announceStartup.js';
import setBotActivity from '../startup/setBotActivity.js';
import ensureAllGuildEmojis from '../startup/ensureAllGuildEmojis.js';
import registerSlashCommands from '../startup/registerSlashCommands.js';
import setupDisTube from '../startup/setupDisTube.js';

export default {
  name: 'ready',
  once: true,
  async execute(client) {
    printCommandTable(client);
    announceStartup();
    setBotActivity(client);
    await ensureAllGuildEmojis(client);
    await registerSlashCommands(client);
    await setupDisTube(client);
  },
};
