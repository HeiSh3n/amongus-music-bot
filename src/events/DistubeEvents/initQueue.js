import { ChannelType } from 'discord.js';

export default {
  event: 'initQueue',
  once: false,
  handler(queue, client) {
    try {
      // Set default autoplay to false
      queue.autoplay = false;

      // If textChannel is not set, try to set it
      if (!queue.textChannel) {
        let set = false;
        // Try to use the channel from the last message if available
        if (queue.metadata && queue.metadata.textChannel && typeof queue.metadata.textChannel.send === 'function') {
          queue.textChannel = queue.metadata.textChannel;
          set = true;
        } else if (queue.metadata && queue.metadata.channel && typeof queue.metadata.channel.send === 'function') {
          queue.textChannel = queue.metadata.channel;
          set = true;
        } else if (queue.distube && queue.distube.client && queue.id) {
          // Fallback: use the first available text channel in the guild
          const guild = queue.distube.client.guilds.cache.get(queue.id);
          if (guild) {
            const firstTextChannel = guild.channels.cache.find(
              ch => ch.type === ChannelType.GuildText && ch.viewable && ch.permissionsFor(guild.members.me).has('SendMessages')
            );
            if (firstTextChannel) {
              queue.textChannel = firstTextChannel;
              set = true;
            }
          }
        }
        if (!set) {
          console.warn(`Failed to set text channel for queue ${queue.id}`);
        }
      }
      // Log queue initialization
      console.log(`Queue initialized for guild ${queue.id}`);
    } catch (error) {
      console.error('Error in initQueue event handler:', error);
    }
  }
}; 