import { SlashCommandBuilder } from 'discord.js';

export default {
  data: new SlashCommandBuilder()
    .setName('skipto')
    .setDescription('Skip to a certain song in the queue!')
    .addIntegerOption(option =>
      option.setName('songnumber')
        .setDescription('The position of the song in the queue to skip to (1 = first up-next)')
        .setRequired(true)
    ),
  name: 'skipto',
  category: 'music',
  aliases: ['st'],
  description: 'Skip to a certain song!',
  usage: 'skipto <songnumber>',
  async execute(interactionOrMessage, client, args) {
    const isSlashCommand = interactionOrMessage.isCommand && typeof interactionOrMessage.isCommand === 'function' && interactionOrMessage.isCommand();
    const userIndex = isSlashCommand
      ? interactionOrMessage.options.getInteger('songnumber')
      : parseInt(args[0]);
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
    // Only allow skipping to up-next songs (not the currently playing song)
    // User index 1 = queue.songs[1], index 2 = queue.songs[2], etc.
    if (
      isNaN(userIndex) ||
      userIndex <= 0 ||
      userIndex >= queue.songs.length // songs[0] is currently playing, so max valid is songs.length-1
    ) {
      const msg = `❌ **Invalid song number! Please provide a valid song position in the queue.**\nValid range: 1-${queue.songs.length - 1} (1 = first up-next)`;
      return isSlashCommand
        ? await interactionOrMessage.reply({ content: msg, ephemeral: true })
        : await interactionOrMessage.channel.send(msg);
    }
    try {
      const songToSkipTo = queue.songs[userIndex];
      await (isSlashCommand
        ? interactionOrMessage.reply({ content: `⏩ **Skipped to** \`${songToSkipTo.name}\`` })
        : interactionOrMessage.channel.send(`⏩ **Skipped to** \`${songToSkipTo.name}\``));
      // Jump to the song in the queue (userIndex is 1-based for up-next, so pass userIndex-1 to distube.jump)
      await client.distube.jump(interactionOrMessage, userIndex - 1);
    } catch (error) {
      console.error('Error while skipping to a specific song:', error);
      const msg = '❌ **An error occurred while trying to skip to the song.**';
      return isSlashCommand
        ? await interactionOrMessage.reply({ content: msg, ephemeral: true })
        : await interactionOrMessage.channel.send(msg);
    }
  }
}; 