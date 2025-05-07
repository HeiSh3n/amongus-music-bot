import { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } from 'discord.js';

export default {
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Returns latency and API ping'),
  name: 'ping',
  category: 'utility',
  description: 'Returns latency and API ping',
  usage: 'ping',
  async execute(interactionOrMessage, client, args) {
    // Detect if this is a slash command
    const isSlashCommand = interactionOrMessage.isCommand && typeof interactionOrMessage.isCommand === 'function' && interactionOrMessage.isCommand();
    let initialMessage;
    try {
      // Send initial message
      if (isSlashCommand) {
        initialMessage = await interactionOrMessage.reply({ content: '🏓 Pinging...', fetchReply: true, ephemeral: true });
      } else if (interactionOrMessage.channel) {
        initialMessage = await interactionOrMessage.channel.send('🏓 Pinging...');
      } else {
        console.error('interactionOrMessage is not a slash command or does not have a channel.');
        return;
      }
      // Calculate latency
      const latency = Math.floor(initialMessage.createdTimestamp - interactionOrMessage.createdTimestamp);
      const apiLatency = Math.round(client.ws.ping);
      // Create embed message
      const embed = new EmbedBuilder()
        .setTitle('🏓 Pong!')
        .setDescription(`🏓🏓🏓\nLatency is ${latency}ms\nAPI Latency is ${apiLatency}ms\n🏓🏓🏓`)
        .setColor('Random');
      // Edit initial message with embed
      if (isSlashCommand) {
        await interactionOrMessage.editReply({ content: null, embeds: [embed] });
        // Delete ephemeral reply after 10 seconds
        setTimeout(async () => {
          try {
            await interactionOrMessage.deleteReply();
          } catch (e) {
            // Ignore if already deleted or not allowed
          }
        }, 10000);
      } else {
        await initialMessage.edit({ content: null, embeds: [embed] });
        setTimeout(async () => {
          try {
            await initialMessage.delete();
          } catch (e) {
            // Ignore if already deleted
          }
        }, 10000);
      }
    } catch (error) {
      console.error('Error executing ping command:', error);
      if (isSlashCommand) {
        await interactionOrMessage.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
      } else if (interactionOrMessage.channel) {
        await interactionOrMessage.channel.send('There was an error while executing this command!');
      }
    }
  }
}; 