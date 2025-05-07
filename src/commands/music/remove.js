import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';

export default {
  data: new SlashCommandBuilder()
    .setName('remove')
    .setDescription('Remove a song from the current queue')
    .addIntegerOption(option =>
      option.setName('index')
        .setDescription('The index of the song to remove from the queue (1 = first up-next)')
        .setRequired(true)
    ),
  name: 'remove',
  category: 'music',
  description: 'Remove a song from the current queue',
  usage: 'remove <index>',
  async execute(interactionOrMessage, client, args) {
    const isSlashCommand = interactionOrMessage.isCommand && typeof interactionOrMessage.isCommand === 'function' && interactionOrMessage.isCommand();
    const userIndex = isSlashCommand
      ? interactionOrMessage.options.getInteger('index')
      : parseInt(args[0]);
    const guild = interactionOrMessage.guild;
    const queue = client.distube.getQueue(guild);
    const memberVoiceChannel = interactionOrMessage.member?.voice?.channel;
    const botVoiceChannel = guild.members.me.voice.channel;

    if (!memberVoiceChannel) {
      const msg = '❌ **Please join the voice channel!**';
      return isSlashCommand
        ? await interactionOrMessage.reply({ content: msg, ephemeral: true })
        : await interactionOrMessage.channel.send(msg);
    }
    if (!botVoiceChannel) {
      const msg = '❌ **I am not connected to a voice channel.** `Use /join to get me in`';
      return isSlashCommand
        ? await interactionOrMessage.reply({ content: msg, ephemeral: true })
        : await interactionOrMessage.channel.send(msg);
    }
    if (memberVoiceChannel.id !== botVoiceChannel.id) {
      const msg = '❌ **You are not in the same voice channel as I am!**';
      return isSlashCommand
        ? await interactionOrMessage.reply({ content: msg, ephemeral: true })
        : await interactionOrMessage.channel.send(msg);
    }
    if (!queue) {
      const msg = '❌ **There is nothing playing!**';
      return isSlashCommand
        ? await interactionOrMessage.reply({ content: msg, ephemeral: true })
        : await interactionOrMessage.channel.send(msg);
    }

    // Only allow removing from the up-next queue (not the currently playing song)
    // User index 1 = queue.songs[1], index 2 = queue.songs[2], etc.
    if (
      isNaN(userIndex) ||
      userIndex <= 0 ||
      userIndex >= queue.songs.length // songs[0] is currently playing, so max valid is songs.length-1
    ) {
      const embed = new EmbedBuilder()
        .setDescription('❌ **Invalid Usage**')
        .addFields(
          { name: '\u200B', value: '.remove [index]' },
          { name: '\u200B', value: 'Example: `.remove 1` (removes the first up-next song)' },
          { name: '\u200B', value: `Valid range: 1-${queue.songs.length - 1} (1 = first up-next)` }
        )
        .setColor('Red');
      return isSlashCommand
        ? await interactionOrMessage.reply({ embeds: [embed], ephemeral: true })
        : await interactionOrMessage.channel.send({ embeds: [embed] });
    }

    const removedSong = queue.songs[userIndex];
    if (!removedSong) {
      const msg = '❌ **No song found at that index!**';
      return isSlashCommand
        ? await interactionOrMessage.reply({ content: msg, ephemeral: true })
        : await interactionOrMessage.channel.send(msg);
    }

    queue.songs.splice(userIndex, 1);
    const msg = `✅ **Removed from queue:** \`${removedSong.name}\``;
    return isSlashCommand
      ? await interactionOrMessage.reply({ content: msg })
      : await interactionOrMessage.channel.send(msg);
  }
}; 