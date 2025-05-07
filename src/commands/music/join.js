import { SlashCommandBuilder } from 'discord.js';

export default {
  data: new SlashCommandBuilder()
    .setName('join')
    .setDescription('Connect to a voice channel!'),
  name: 'join',
  category: 'music',
  aliases: ['connect'],
  description: 'Connect to a voice channel!',
  usage: 'join',
  async execute(interactionOrMessage, client, args) {
    // Detect if this is a slash command
    const isSlashCommand = interactionOrMessage.isCommand && typeof interactionOrMessage.isCommand === 'function' && interactionOrMessage.isCommand();
    const guild = interactionOrMessage.guild;
    const member = interactionOrMessage.member;
    // Ensure the member is in a voice channel
    const voiceChannel = member?.voice?.channel;
    if (!voiceChannel) {
      const msg = '❌ **You need to be in a voice channel to use this command!**';
      return isSlashCommand
        ? await interactionOrMessage.reply({ content: msg, ephemeral: true })
        : await interactionOrMessage.channel.send(msg);
    }
    try {
      // Join the voice channel
      await client.distube.voices.join(voiceChannel);
      const msg = `👍 **Joined** \`${voiceChannel.name}\``;
      return isSlashCommand
        ? await interactionOrMessage.reply({ content: msg })
        : await interactionOrMessage.channel.send(msg);
    } catch (error) {
      console.error('Command Execution Error:', error);
      const msg = '❌ **An error occurred while trying to join the voice channel. Please try again later.**';
      return isSlashCommand
        ? await interactionOrMessage.reply({ content: msg, ephemeral: true })
        : await interactionOrMessage.channel.send(msg);
    }
  }
}; 