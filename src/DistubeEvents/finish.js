import { EmbedBuilder } from 'discord.js';

export default {
  event: 'finish',
  once: false,
  handler(queue, client) {
    // Set a 10-minute timer to leave if no new songs are added
    const inactivityTimeout = setTimeout(async () => {
      try {
        if (!queue.voice || queue.voice.isDisconnected) return;
        const voiceChannel = queue.voice.connection?.joinConfig?.channelId
          ? queue.distube.client.channels.cache.get(queue.voice.connection.joinConfig.channelId)
          : null;
        const botAlone = voiceChannel && voiceChannel.members.size === 1;
        if (botAlone) {
          if (queue.textChannel && typeof queue.textChannel.send === 'function') {
            await queue.textChannel.send('👋 Leaving voice channel due to inactivity.').catch(err => {
              console.error('Error sending leave message:', err);
            });
          }
          console.log('Disconnected due to inactivity.');
          queue.distube.voices.leave(queue.id);
        }
      } catch (err) {
        console.error('Error in inactivity timeout handler:', err);
      }
    }, 10 * 60 * 1000); // 10 minutes

    // Store the timeout in the queue object so it can be cleared if needed
    queue._leaveTimeout = inactivityTimeout;
  }
}; 