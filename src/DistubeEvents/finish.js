import { EmbedBuilder } from 'discord.js';

export default {
  event: 'finish',
  once: false,
  handler(queue, client) {
    // Clear any existing leave timeout before setting a new one
    if (queue._leaveTimeout) {
      clearTimeout(queue._leaveTimeout);
      queue._leaveTimeout = null;
    }

    // Set a 5-minute timer to leave if no new songs are added
    const inactivityTimeout = setTimeout(async () => {
      try {
        if (!queue.voice || queue.voice.isDisconnected) return;
        // Always leave after 5 minutes of inactivity, regardless of who is in the channel
        if (queue.textChannel && typeof queue.textChannel.send === 'function') {
          await queue.textChannel.send('👋 Leaving voice channel due to inactivity.').catch(err => {
            console.error('Error sending leave message:', err);
          });
        }
        console.log('Disconnected due to inactivity.');
        queue.distube.voices.leave(queue.id);
      } catch (err) {
        console.error('Error in inactivity timeout handler:', err);
      }
    }, 5 * 60 * 1000); // 5 minutes

    // Store the timeout in the queue object so it can be cleared if needed
    queue._leaveTimeout = inactivityTimeout;
  }
}; 