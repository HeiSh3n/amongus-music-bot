export default {
  name: 'interactionCreate',
  once: false,
  async execute(interaction, client) {
    // Only handle slash commands (ignore buttons, selects, etc.)
    if (!interaction.isCommand()) return;
    const command = client.commands.get(interaction.commandName);
    if (!command) return;
    try {
      await command.execute(interaction, client);
    } catch (error) {
      console.error(error);
      // Always reply with an ephemeral error message for slash commands
      await interaction.reply({ content: 'There was an error executing this command.', ephemeral: true });
    }
  },
}; 