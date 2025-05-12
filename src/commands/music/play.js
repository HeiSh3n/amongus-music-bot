import { SlashCommandBuilder, EmbedBuilder, ChannelType } from 'discord.js';
import { areEmojisAdded } from '../../services/emojiDatabase.js';

export default {
  data: new SlashCommandBuilder()
    .setName('play')
    .setDescription('Play a song from a URL or search query!')
    .addStringOption(option =>
      option.setName('query')
        .setDescription('The name or URL of the song to play')
        .setRequired(true)
    ),
  name: 'play',
  category: 'music',
  aliases: ['p'],
  description: 'Play a song from a URL or search query!',
  async execute(interactionOrMessage, client, args) {
    // Use the same detection as other commands
    const isSlashCommand = interactionOrMessage.isCommand && typeof interactionOrMessage.isCommand === 'function' && interactionOrMessage.isCommand();
    const guild = interactionOrMessage.guild;
    const member = interactionOrMessage.member;
    const channel = interactionOrMessage.channel;
    // Get the song query from the correct source
    const music = isSlashCommand
      ? interactionOrMessage.options.getString('query')
      : (Array.isArray(args) ? args.join(' ') : '');
    try {
      if (!guild) {
        const msg = '❌ **This command can only be used in a server!**';
        return isSlashCommand
          ? await interactionOrMessage.reply({ content: msg, flags: 1 << 6 })
          : await channel.send(msg);
      }
      // Ensure the member is in a voice channel
      const voiceChannel = member?.voice?.channel;
      if (!voiceChannel) {
        const msg = '❌ **You need to be in a voice channel to use this command!**';
        return isSlashCommand
          ? await interactionOrMessage.reply({ content: msg, flags: 1 << 6 })
          : await channel.send(msg);
      }
      // Ensure the bot is in the same voice channel if already connected
      const botVoiceChannel = guild.members.me.voice.channel;
      if (botVoiceChannel && voiceChannel.id !== botVoiceChannel.id) {
        const msg = '❌ **You are not in the same voice channel as I am!**';
        return isSlashCommand
          ? await interactionOrMessage.reply({ content: msg, flags: 1 << 6 })
          : await channel.send(msg);
      }
      // Check if the music query is provided
      if (!music) {
        const embed = new EmbedBuilder()
          .setColor('#E74C3C')
          .setTitle('❌ **You didn\'t provide a song!**')
          .setDescription('Usage: `/play <Song>` or `!play <Song>`');
        return isSlashCommand
          ? await interactionOrMessage.reply({ embeds: [embed], flags: 1 << 6 })
          : await channel.send({ embeds: [embed] });
      }
      // Fetch custom emojis from the guild, fallback to default if not present
      const spotifyEmoji = guild.emojis.cache.find(e => e.name === 'Spotify') || '🎵';
      const youtubeEmoji = guild.emojis.cache.find(e => e.name === 'YouTube') || '🎵';
      const neteaseEmoji = guild.emojis.cache.find(e => e.name === 'NetEase') || '🎵';
      // Determine which emoji to use based on the song source
      let searchMessage = `🔎 **Searching** 🎵 \`${music}\``;
      if (music.toLowerCase().includes('spotify')) {
        searchMessage = `${spotifyEmoji} **Searching** 🎵 \`${music}\``;
      } else if (music.toLowerCase().includes('youtube')) {
        searchMessage = `${youtubeEmoji} **Searching** 🎵 \`${music}\``;
      } else if (music.toLowerCase().includes('music.163.com')) {
        searchMessage = `${neteaseEmoji} **Searching** 🎵 \`${music}\``;
      }
      // Inform the user about the search
      if (isSlashCommand) {
        await interactionOrMessage.reply({ content: searchMessage });
      } else {
        await channel.send(searchMessage);
      }
      // Check if the channel is a text channel
      if (channel.type !== ChannelType.GuildText) {
        const msg = '❌ **This command must be used in a server text channel!**';
        return isSlashCommand
          ? await interactionOrMessage.reply({ content: msg, flags: 1 << 6 })
          : await channel.send(msg);
      }
      // Use DisTube's play method to play the song
      await client.distube.play(voiceChannel, music, {
        member: member,
        textChannel: channel,
        message: isSlashCommand ? undefined : interactionOrMessage,
      });
    } catch (e) {
      console.error('Command Execution Error:', e);
      let msg = '❌ **An error occurred while executing the command. Please try again later.**';
      if (e?.errorCode === 'CANNOT_RESOLVE_SONG' || e?.message?.includes('Cannot resolve')) {
        msg = '❌ **Could not find a song for your query. Please try a more specific name or a direct URL.**';
      }
      return isSlashCommand
        ? await interactionOrMessage.reply({ content: msg, flags: 1 << 6 })
        : await channel.send(msg);
    }
  }
}; 