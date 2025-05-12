export default {
    event: 'error',
    once: false,
    handler(channel, error, client) {
        console.error('DisTube Error:', error);
        const errorMsg = `❌ An error encountered: \`${error?.message || error}\``;
        // Try to send to the provided channel
        if (channel && typeof channel.send === 'function') {
            channel.send(errorMsg).catch(err => {
                console.error('Failed to send error message to channel:', err);
            });
            return;
        }
        // Try to send to the queue's textChannel if available
        if (error?.queue && error.queue.textChannel && typeof error.queue.textChannel.send === 'function') {
            error.queue.textChannel.send(errorMsg).catch(err => {
                console.error('Failed to send error message to queue.textChannel:', err);
            });
            return;
        }
        // Fallback: try to send to any system channel in any guild
        if (client && client.guilds) {
            for (const guild of client.guilds.cache.values()) {
                const systemChannel = guild.systemChannel;
                if (systemChannel && typeof systemChannel.send === 'function') {
                    systemChannel.send(`❌ DisTube Error: \`${error?.message || error}\``).catch(() => {});
                    console.log(`Sent error message to system channel in ${guild.name}`);
                    return;
                }
            }
        }
        // If all else fails, log the error
        console.error('DisTube Error (No Text Channel):', error);
    },
}; 