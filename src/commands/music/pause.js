import { SlashCommandBuilder } from 'discord.js';

export default {
  data: new SlashCommandBuilder()
    .setName('pause')
    .setDescription('Pause the currently playing song!'),
  name: 'pause',
  category: 'music',
  aliases: ['stop'],
  description: 'Pause the currently playing song!',
  usage: 'pause',
  async execute(interactionOrMessage, client, args) {
    // Detect if this is a slash command
    const isSlashCommand = interactionOrMessage.isCommand && typeof interactionOrMessage.isCommand === 'function' && interactionOrMessage.isCommand();
    const guild = interactionOrMessage.guild;
    const member = interactionOrMessage.member;
    // Check if the member is in a voice channel
    const voiceChannel = member?.voice?.channel;
    if (!voiceChannel) {
      const msg = '❌ **Please join a voice channel!**';
      return isSlashCommand
        ? await interactionOrMessage.reply({ content: msg, ephemeral: true })
        : await interactionOrMessage.channel.send(msg);
    }
    // Get the current queue for the guild
    const queue = client.distube.getQueue(guild);
    if (!queue) {
      const msg = '❌ **There is nothing in the queue right now!**';
      return isSlashCommand
        ? await interactionOrMessage.reply({ content: msg, ephemeral: true })
        : await interactionOrMessage.channel.send(msg);
    }
    // Check if the queue is already paused
    if (queue.paused) {
      const msg = '❌ **It is already paused!**';
      return isSlashCommand
        ? await interactionOrMessage.reply({ content: msg, ephemeral: true })
        : await interactionOrMessage.channel.send(msg);
    }
    // Pause the queue
    queue.pause();
    const msg = '**Paused** ⏸️';
    return isSlashCommand
      ? await interactionOrMessage.reply({ content: msg })
      : await interactionOrMessage.channel.send(msg);
  }
}; 