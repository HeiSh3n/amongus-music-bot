import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';

export default {
  data: new SlashCommandBuilder()
    .setName('purge')
    .setDescription('Clears a specified number of messages from the chat')
    .addIntegerOption(option =>
      option.setName('amount')
        .setDescription('Number of messages to delete (max 100)')
        .setRequired(true)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),
  name: 'purge',
  category: 'moderation',
  aliases: [], // Add aliases if needed
  description: 'Clears the chat',
  usage: 'purge <amount>',
  async execute(interactionOrMessage, client, args) {
    // Detect if this is a slash command
    const isSlashCommand = interactionOrMessage.isCommand && typeof interactionOrMessage.isCommand === 'function' && interactionOrMessage.isCommand();
    const channel = interactionOrMessage.channel;
    const member = interactionOrMessage.member;
    const amount = isSlashCommand
      ? interactionOrMessage.options.getInteger('amount')
      : (args[0] && !isNaN(parseInt(args[0])) ? parseInt(args[0]) : null);
    // Delete the original message if it's a text-based command
    if (!isSlashCommand && interactionOrMessage.deletable) {
      await interactionOrMessage.delete().catch(() => {});
    }
    // Check if member has permission to manage messages
    if (!member?.permissions?.has(PermissionFlagsBits.ManageMessages)) {
      const msg = '❌ **You do not have permission to manage messages!**';
      return isSlashCommand
        ? await interactionOrMessage.reply({ content: msg, ephemeral: true })
        : await channel.send(msg).then(m => setTimeout(() => m.delete().catch(() => {}), 2000));
    }
    // Check if bot has permission to manage messages
    if (!channel.guild?.members?.me?.permissions?.has(PermissionFlagsBits.ManageMessages)) {
      const msg = '❌ **I do not have permission to manage messages!**';
      return isSlashCommand
        ? await interactionOrMessage.reply({ content: msg, ephemeral: true })
        : await channel.send(msg).then(m => setTimeout(() => m.delete().catch(() => {}), 2000));
    }
    // Validate the amount to delete
    if (!amount || isNaN(amount) || amount <= 0) {
      const msg = '❌ **Please specify a valid number of messages to delete (greater than 0)!**';
      return isSlashCommand
        ? await interactionOrMessage.reply({ content: msg, ephemeral: true })
        : await channel.send(msg).then(m => setTimeout(() => m.delete().catch(() => {}), 2000));
    }
    // Limit the delete amount to 100 messages
    const deleteAmount = Math.min(amount, 100);
    try {
      // Bulk delete messages
      const deletedMessages = await channel.bulkDelete(deleteAmount, true);
      // Inform the user about the deletion
      const replyMessage = isSlashCommand
        ? await interactionOrMessage.reply({ content: `🗑️ **Deleted \`${deletedMessages.size}\` messages.**`, fetchReply: true })
        : await channel.send(`🗑️ **Deleted \`${deletedMessages.size}\` messages.**`);
      setTimeout(() => replyMessage.delete().catch(() => {}), 2000);
    } catch (error) {
      console.error('Error while deleting messages:', error);
      const msg = `❌ **An error occurred while trying to delete messages: ${error.message}**`;
      return isSlashCommand
        ? await interactionOrMessage.reply({ content: msg, ephemeral: true })
        : await channel.send(msg);
    }
  }
}; 