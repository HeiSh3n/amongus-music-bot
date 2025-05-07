import { SlashCommandBuilder } from 'discord.js';

export default {
  data: new SlashCommandBuilder()
    .setName('loopqueue')
    .setDescription('Loop the current queue'),
  name: 'loopqueue',
  category: 'music',
  aliases: ['lq'],
  description: 'Loop current queue',
  usage: 'loopqueue',
  async execute(interactionOrMessage, client, args) {
    // Detect if this is a slash command
    const isSlashCommand = interactionOrMessage.isCommand && typeof interactionOrMessage.isCommand === 'function' && interactionOrMessage.isCommand();
    const guild = interactionOrMessage.guild;
    const member = interactionOrMessage.member;
    // Check if the member is in a voice channel
    const voiceChannel = member?.voice?.channel;
    if (!voiceChannel) {
      const msg = '❌ **Please join the voice channel!**';
      return isSlashCommand
        ? await interactionOrMessage.reply({ content: msg, ephemeral: true })
        : await interactionOrMessage.channel.send(msg);
    }
    // Ensure the bot is in the same voice channel
    const botVoiceChannel = guild.members.me.voice.channel;
    if (botVoiceChannel && voiceChannel.id !== botVoiceChannel.id) {
      const msg = '❌ **You are not in the same voice channel as I am!**';
      return isSlashCommand
        ? await interactionOrMessage.reply({ content: msg, ephemeral: true })
        : await interactionOrMessage.channel.send(msg);
    }
    const queue = client.distube.getQueue(guild);
    if (!queue) {
      const msg = '**There is nothing playing!**';
      return isSlashCommand
        ? await interactionOrMessage.reply({ content: msg, ephemeral: true })
        : await interactionOrMessage.channel.send(msg);
    }
    // Toggle queue loop mode
    if (queue.repeatMode === 1 || queue.repeatMode === 0) {
      queue.setRepeatMode(2);
      const msg = '🔄 **Queue Loop Enabled**';
      return isSlashCommand
        ? await interactionOrMessage.reply({ content: msg })
        : await interactionOrMessage.channel.send(msg);
    } else if (queue.repeatMode === 2) {
      queue.setRepeatMode(0);
      const msg = '❌ **Disabled Queue Loop**';
      return isSlashCommand
        ? await interactionOrMessage.reply({ content: msg })
        : await interactionOrMessage.channel.send(msg);
    }
  }
}; 