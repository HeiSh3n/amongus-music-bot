import { EmbedBuilder } from 'discord.js';

export default {
  event: 'playSong',
  once: false,
  handler(queue, song, client) {
    // Ensure a valid text channel before trying to send messages
    if (!queue.textChannel) {
      console.error('Cannot send playSong message: No text channel found for', queue.id, 'playing', song.name);
      return;
    }
    try {
      if (song.playlist) {
        const embed = new EmbedBuilder()
          .setTitle('**Playlist added to queue**')
          .setDescription(`${song.playlist.name}`)
          .setThumbnail(song.playlist.thumbnail)
          .addFields(
            { name: '**Estimated Time until playing**', value: 'Now' },
            { name: '**Position in queue**', value: 'Now', inline: true },
            { name: '**Enqueued**', value: `\`${queue.songs.length}\` songs`, inline: true }
          )
          .setColor('Random');
        queue.textChannel.send({ embeds: [embed] }).catch(err => {
          console.error('Error sending playlist message:', err);
        });
      } else {
        queue.textChannel.send(`**Playing** 🎵 \`${song.name}\` - Now!`).catch(err => {
          console.error('Error sending song message:', err);
        });
      }
    } catch (error) {
      console.error('Error in playSong event handler:', error);
    }
  },
}; 