import { isVoiceChannelEmpty } from 'distube';

// Map to store leave timeouts per guild
const leaveTimeouts = new Map();

export default {
  name: 'voiceStateUpdate',
  once: false,
  async execute(oldState, newState, client) {
    // Only care about voice channel changes
    const botId = client.user.id;
    // Check if the bot is in a voice channel in this guild
    const guild = oldState.guild || newState.guild;
    const botMember = guild.members.me;
    const botVoiceChannel = botMember?.voice?.channel;
    if (!botVoiceChannel) return;

    // If the bot is not in the channel anymore, clear any timeout
    if (!botVoiceChannel.members.has(botId)) {
      if (leaveTimeouts.has(guild.id)) {
        clearTimeout(leaveTimeouts.get(guild.id));
        leaveTimeouts.delete(guild.id);
      }
      return;
    }

    // If the bot is alone in the channel, start a 5-minute leave timer
    if (botVoiceChannel.members.size === 1) {
      if (!leaveTimeouts.has(guild.id)) {
        // Capture the text channel reference now
        const queue = client.distube.queues.get(guild.id);
        const textChannel = queue?.textChannel;
        const timeout = setTimeout(() => {
          try {
            client.distube.voices.leave(guild.id);
            if (textChannel && typeof textChannel.send === 'function') {
              textChannel.send('👋 Leaving voice channel due to inactivity (bot alone).').catch(() => {});
            }
          } catch (err) {
            console.error('Error auto-leaving voice channel:', err);
          }
          leaveTimeouts.delete(guild.id);
        }, 5 * 60 * 1000); // 5 minutes
        leaveTimeouts.set(guild.id, timeout);
      }
    } else {
      // If someone joins, clear the leave timer
      if (leaveTimeouts.has(guild.id)) {
        clearTimeout(leaveTimeouts.get(guild.id));
        leaveTimeouts.delete(guild.id);
      }
    }
  },
}; 