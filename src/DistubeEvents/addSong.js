import { EmbedBuilder } from 'discord.js';

export default {
  event: 'addSong',
  once: false,
  handler(queue, song, client) {
    // Only emit if this is NOT the first song in the queue
    if (!queue.textChannel) {
      console.error('Cannot send addSong message: No text channel found for', queue.id, 'adding', song.name);
      return;
    }
    if (queue.songs.length <= 1) {
      // First song: let playSong.js handle the notification
      return;
    }
    try {
      const embed = new EmbedBuilder()
        .setTitle('**Added to queue**')
        .setDescription(`[${song.name}](${song.url})`)
        .setThumbnail(song.thumbnail)
        .addFields(
          { name: '**Channel**', value: song.uploader?.name || 'Unknown', inline: true },
          { name: '**Song Duration**', value: song.formattedDuration || 'Unknown', inline: true },
          { name: '**Estimated Time Until Playing**', value: queue.formattedCurrentTime || 'Unknown', inline: true },
          { name: '**Position in Queue**', value: `${queue.songs.length - 1}` }
        );
      queue.textChannel.send({ embeds: [embed] }).catch(err => {
        console.error('Error sending addSong message:', err);
      });
    } catch (error) {
      console.error('Error in addSong event handler:', error);
    }
    // Clear inactivity timeout if it exists
    if (queue._leaveTimeout) {
      clearTimeout(queue._leaveTimeout);
      queue._leaveTimeout = null;
    }
  },
}; 