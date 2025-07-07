import { EmbedBuilder } from 'discord.js';

export default {
  event: 'empty',
  once: false,
  handler(queue, client) {
    // Clear any existing leave timeout before setting a new one
    if (queue._leaveTimeout) {
      clearTimeout(queue._leaveTimeout);
      queue._leaveTimeout = null;
    }
    // Set a 5-minute timer to leave if the channel remains empty
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
    }, 5 * 60 * 1000); // 5 minutes
    queue._leaveTimeout = inactivityTimeout;
  }
}; 