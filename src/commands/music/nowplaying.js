import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';

// Custom function to format seconds as mm:ss or hh:mm:ss
function toColonNotation(seconds) {
  seconds = Math.floor(seconds);
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return h > 0
    ? `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
    : `${m}:${s.toString().padStart(2, '0')}`;
}

// Custom progress bar generator
function makeProgressBar(totalSeconds, currentSeconds, barLength = 20) {
  if (!totalSeconds || totalSeconds === 0) return '🔘' + '▬'.repeat(barLength);
  const progress = Math.min(currentSeconds / totalSeconds, 1);
  const filledLength = Math.floor(barLength * progress);
  const emptyLength = barLength - filledLength;
  // Place the indicator at the current position, unless at the end
  if (filledLength >= barLength) {
    return '▬'.repeat(barLength) + '🔘';
  }
  return '▬'.repeat(filledLength) + '🔘' + '▬'.repeat(emptyLength - 1);
}

export default {
  data: new SlashCommandBuilder()
    .setName('nowplaying')
    .setDescription('Check the current queue!'),
  name: 'nowplaying',
  category: 'music',
  aliases: ['np', 'nowplay'],
  description: 'Check the current queue!',
  usage: 'nowplaying',
  async execute(interactionOrMessage, client, args) {
    // Detect if this is a slash command
    const isSlashCommand = interactionOrMessage.isCommand && typeof interactionOrMessage.isCommand === 'function' && interactionOrMessage.isCommand();
    const guild = interactionOrMessage.guild;
    const queue = client.distube.getQueue(guild);
    if (!queue) {
      const noQueueEmbed = new EmbedBuilder()
        .setTitle(`**Queue for ${guild.name}**`)
        .setDescription('Nothing Playing!');
      return isSlashCommand
        ? await interactionOrMessage.reply({ embeds: [noQueueEmbed] })
        : await interactionOrMessage.channel.send({ embeds: [noQueueEmbed] });
    }
    // Parse time as seconds for progress bar
    function parseTime(str) {
      if (!str || str === '0:00') return 0;
      const parts = str.split(':').map(Number);
      if (parts.length === 3) {
        return parts[0] * 3600 + parts[1] * 60 + parts[2];
      } else if (parts.length === 2) {
        return parts[0] * 60 + parts[1];
      } else {
        return Number(parts[0]) || 0;
      }
    }
    const total = parseTime(queue.songs[0].formattedDuration);
    const current = parseTime(queue.formattedCurrentTime);
    const bar = makeProgressBar(total, current, 20);
    const nowPlayingEmbed = new EmbedBuilder()
      .setTitle('**Now Playing** ♪')
      .setThumbnail(queue.songs[0].thumbnail)
      .setDescription(`[${queue.songs[0].name}](${queue.songs[0].url})`)
      .addFields(
        { name: `${bar}`, value: `\`${toColonNotation(current)} / ${toColonNotation(total)}\`` },
        { name: '\u200B', value: `\`Requested by:\` ${queue.songs[0].user.tag}`, inline: true }
      );
    // Send the embed to the appropriate channel
    if (isSlashCommand) {
      await interactionOrMessage.reply({ embeds: [nowPlayingEmbed] });
    } else {
      await interactionOrMessage.channel.send({ embeds: [nowPlayingEmbed] });
    }
  }
}; 