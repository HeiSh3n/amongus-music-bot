import { SlashCommandBuilder } from 'discord.js';

export default {
  data: new SlashCommandBuilder()
    .setName('resume')
    .setDescription('Resume playing the currently paused song'),
  name: 'resume',
  category: 'music',
  aliases: ['unpause'],
  description: 'Resume playing the currently paused song',
  usage: 'resume',
  async execute(interactionOrMessage, client, args) {
    const isSlashCommand = interactionOrMessage.isCommand && typeof interactionOrMessage.isCommand === 'function' && interactionOrMessage.isCommand();
    const memberVoiceChannel = interactionOrMessage.member?.voice?.channel;
    const botVoiceChannel = interactionOrMessage.guild.members.me.voice.channel;
    if (!memberVoiceChannel) {
      const msg = '❌ **Please join the voice channel!**';
      return isSlashCommand
        ? await interactionOrMessage.reply({ content: msg, ephemeral: true })
        : await interactionOrMessage.channel.send(msg);
    }
    if (botVoiceChannel && memberVoiceChannel.id !== botVoiceChannel.id) {
      const msg = '❌ **You are not in the same voice channel as I am!**';
      return isSlashCommand
        ? await interactionOrMessage.reply({ content: msg, ephemeral: true })
        : await interactionOrMessage.channel.send(msg);
    }
    const queue = client.distube.getQueue(interactionOrMessage);
    if (!queue) {
      const msg = '❌ **There is nothing in the queue right now!**';
      return isSlashCommand
        ? await interactionOrMessage.reply({ content: msg, ephemeral: true })
        : await interactionOrMessage.channel.send(msg);
    }
    if (!queue.paused) {
      const msg = '❌ **The song is not paused!**';
      return isSlashCommand
        ? await interactionOrMessage.reply({ content: msg, ephemeral: true })
        : await interactionOrMessage.channel.send(msg);
    }
    queue.resume();
    const msg = '⏯ **Resuming**';
    return isSlashCommand
      ? await interactionOrMessage.reply({ content: msg })
      : await interactionOrMessage.channel.send(msg);
  }
}; 