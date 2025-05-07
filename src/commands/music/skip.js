import { SlashCommandBuilder } from 'discord.js';

export default {
  data: new SlashCommandBuilder()
    .setName('skip')
    .setDescription('Skip the current song!'),
  name: 'skip',
  category: 'music',
  aliases: ['s'],
  description: 'Skip the current song!',
  usage: 'skip',
  async execute(interactionOrMessage, client, args) {
    const isSlashCommand = interactionOrMessage.isCommand && typeof interactionOrMessage.isCommand === 'function' && interactionOrMessage.isCommand();
    const memberVoiceChannel = interactionOrMessage.member?.voice?.channel;
    const botVoiceChannel = interactionOrMessage.guild.members.me.voice.channel;
    if (!memberVoiceChannel) {
      const msg = '❌ **Please join a voice channel!**';
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
    try {
      if (!queue.autoplay && queue.songs.length <= 1) {
        await client.distube.stop(interactionOrMessage);
        const msg = '⏩ **Skipped!**';
        return isSlashCommand
          ? await interactionOrMessage.reply({ content: msg })
          : await interactionOrMessage.channel.send(msg);
      } else {
        await client.distube.skip(interactionOrMessage);
        const msg = '⏩ **Skipped!**';
        return isSlashCommand
          ? await interactionOrMessage.reply({ content: msg })
          : await interactionOrMessage.channel.send(msg);
      }
    } catch (error) {
      console.error('Error while skipping the song:', error);
      const msg = '❌ **An error occurred while trying to skip the song.**';
      return isSlashCommand
        ? await interactionOrMessage.reply({ content: msg, ephemeral: true })
        : await interactionOrMessage.channel.send(msg);
    }
  }
}; 