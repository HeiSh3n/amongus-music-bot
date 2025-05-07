import { SlashCommandBuilder } from 'discord.js';

export default {
  data: new SlashCommandBuilder()
    .setName('volume')
    .setDescription('Change the default volume')
    .addIntegerOption(option =>
      option.setName('level')
        .setDescription('The volume level to set (0-100)')
        .setRequired(true)
    ),
  name: 'volume',
  category: 'music',
  aliases: ['vol'],
  description: 'Change the default volume',
  usage: 'volume <level>',
  async execute(interactionOrMessage, client, args) {
    const isSlashCommand = interactionOrMessage.isCommand && typeof interactionOrMessage.isCommand === 'function' && interactionOrMessage.isCommand();
    const guild = interactionOrMessage.guild;
    const member = interactionOrMessage.member;
    const voiceChannel = member?.voice?.channel;
    const queue = client.distube.getQueue(guild);
    if (!voiceChannel) {
      const response = '**Please join a voice channel!**';
      return isSlashCommand
        ? await interactionOrMessage.reply({ content: response, ephemeral: true })
        : await interactionOrMessage.channel.send(response);
    }
    if (!queue) {
      const response = '**There is nothing in the queue right now!**';
      return isSlashCommand
        ? await interactionOrMessage.reply({ content: response, ephemeral: true })
        : await interactionOrMessage.channel.send(response);
    }
    const volume = isSlashCommand
      ? interactionOrMessage.options.getInteger('level')
      : parseInt(args[0]);
    if (isNaN(volume) || volume < 0 || volume > 100) {
      const response = '**Please enter a valid number between 0 and 100!**';
      return isSlashCommand
        ? await interactionOrMessage.reply({ content: response, ephemeral: true })
        : await interactionOrMessage.channel.send(response);
    }
    client.distube.setVolume(voiceChannel, volume);
    const response = `Volume set to \`${volume}\`!`;
    return isSlashCommand
      ? await interactionOrMessage.reply({ content: response })
      : await interactionOrMessage.channel.send(response);
  }
}; 