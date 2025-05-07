import { SlashCommandBuilder } from 'discord.js';

export default {
  data: new SlashCommandBuilder()
    .setName('leave')
    .setDescription('Disconnect from the voice channel!'),
  name: 'leave',
  category: 'music',
  aliases: ['disconnect', 'dc'],
  description: 'Disconnect from the voice channel!',
  usage: 'leave',
  async execute(interactionOrMessage, client, args) {
    // Detect if this is a slash command
    const isSlashCommand = interactionOrMessage.isCommand && typeof interactionOrMessage.isCommand === 'function' && interactionOrMessage.isCommand();
    const guild = interactionOrMessage.guild;
    // Check if the bot is connected to a voice channel
    const botVoiceChannel = guild?.members?.me?.voice?.channel;
    if (botVoiceChannel) {
      try {
        // Leave the voice channel
        client.distube.voices.leave(guild);
        const msg = '📭 **Successfully disconnected**';
        return isSlashCommand
          ? await interactionOrMessage.reply({ content: msg })
          : await interactionOrMessage.channel.send(msg);
      } catch (error) {
        console.error('Command Execution Error:', error);
        const msg = '❌ **An error occurred while trying to disconnect. Please try again later.**';
        return isSlashCommand
          ? await interactionOrMessage.reply({ content: msg, ephemeral: true })
          : await interactionOrMessage.channel.send(msg);
      }
    } else {
      const msg = isSlashCommand
        ? '❌ **I am not connected to a voice channel.** `Use /join to get me in`'
        : '❌ **I am not connected to a voice channel.** `Use .join to get me in`';
      return isSlashCommand
        ? await interactionOrMessage.reply({ content: msg, ephemeral: true })
        : await interactionOrMessage.channel.send(msg);
    }
  }
}; 