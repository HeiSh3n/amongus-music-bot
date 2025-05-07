import { getPrefix } from '../services/prefixDatabase.js';

export default {
  name: 'messageCreate',
  once: false,
  async execute(message, client) {
    if (message.author.bot || !message.guild) return;

    // Get the prefix for the guild from the database (supports per-guild custom prefix)
    const defaultPrefix = process.env.DEFAULT_PREFIX || '.';
    const prefix = (await getPrefix(message.guild.id)) || defaultPrefix;

    // Ignore messages that don't start with the prefix
    if (!message.content.startsWith(prefix)) return;

    // Parse command and arguments from the message
    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const cmd = args.shift().toLowerCase();
    if (cmd.length === 0) return;

    // Support aliases for prefix commands
    let command = client.commands.get(cmd) || (client.aliases && client.aliases.get && client.commands.get(client.aliases.get(cmd)));

    if (command) {
      try {
        // For compatibility, pass message, client, and args to the command
        await command.execute(message, client, args);
      } catch (error) {
        console.error(error);
        message.reply('There was an error executing that command!');
      }
    }
  },
};