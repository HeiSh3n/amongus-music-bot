import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';
import { setPrefix, getPrefix } from '../../database/adapter.js';

export default {
  data: new SlashCommandBuilder()
    .setName('prefix')
    .setDescription('Change the bot prefix for this server or view the current prefix')
    .addStringOption(option =>
      option.setName('newprefix')
        .setDescription('The new prefix to set')
        .setRequired(false)
    ),
  name: 'prefix',
  category: 'utility',
  description: 'Change the bot prefix for this server or view the current prefix',
  usage: 'prefix [newprefix]',
  async execute(interactionOrMessage, client, args) {
    // Detect if this is a slash command
    const isSlashCommand = interactionOrMessage.isCommand && typeof interactionOrMessage.isCommand === 'function' && interactionOrMessage.isCommand();
    const guildId = interactionOrMessage.guild?.id;
    if (!guildId) {
      const msg = '❌ **This command can only be used in a server!**';
      return isSlashCommand
        ? await interactionOrMessage.reply({ content: msg, ephemeral: true })
        : await interactionOrMessage.channel.send(msg);
    }
    // View current prefix if no new prefix is provided
    const newPrefix = isSlashCommand
      ? interactionOrMessage.options.getString('newprefix')
      : args[0];
    if (!newPrefix) {
      const currentPrefix = await getPrefix(guildId) || process.env.DEFAULT_PREFIX || '.';
      const msg = `The current prefix for this server is: \`${currentPrefix}\``;
      return isSlashCommand
        ? await interactionOrMessage.reply({ content: msg, ephemeral: true })
        : await interactionOrMessage.channel.send(msg);
    }
    // Permission check: only admins can change prefix
    if (!interactionOrMessage.member?.permissions?.has(PermissionFlagsBits.Administrator)) {
      const msg = '❌ **You do not have permission to change the prefix.**';
      return isSlashCommand
        ? await interactionOrMessage.reply({ content: msg, ephemeral: true })
        : await interactionOrMessage.channel.send(msg);
    }
    // Validate new prefix
    if (typeof newPrefix !== 'string' || newPrefix.length < 1 || newPrefix.length > 5) {
      const msg = '❌ **Invalid prefix! The prefix must be 1-5 characters long.**';
      return isSlashCommand
        ? await interactionOrMessage.reply({ content: msg, ephemeral: true })
        : await interactionOrMessage.channel.send(msg);
    }
    // Update the prefix in the database
    await setPrefix(guildId, newPrefix);
    const msg = `✅ **Prefix successfully changed to \`${newPrefix}\`!**`;
    return isSlashCommand
      ? await interactionOrMessage.reply({ content: msg, ephemeral: true })
      : await interactionOrMessage.channel.send(msg);
  }
}; 