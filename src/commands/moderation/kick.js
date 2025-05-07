import { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } from 'discord.js';

export default {
  data: new SlashCommandBuilder()
    .setName('kick')
    .setDescription('Kick a specified user from the server')
    .addUserOption(option =>
      option.setName('target')
        .setDescription('The user to kick')
        .setRequired(true)
    )
    .addStringOption(option =>
      option.setName('reason')
        .setDescription('The reason for kicking')
        .setRequired(false)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers),
  name: 'kick',
  category: 'moderation',
  aliases: [], // Add aliases if needed
  description: 'Kick a specified user from the server',
  usage: 'kick <@user> <reason>',
  async execute(interactionOrMessage, client, args) {
    // Detect if this is a slash command
    const isSlashCommand = interactionOrMessage.isCommand && typeof interactionOrMessage.isCommand === 'function' && interactionOrMessage.isCommand();
    const guild = interactionOrMessage.guild;
    const member = interactionOrMessage.member;
    // Get target member and reason based on command type
    const targetMember = isSlashCommand
      ? interactionOrMessage.options.getMember('target')
      : interactionOrMessage.mentions?.members?.first() || (args[0] && (await guild.members.fetch(args[0].replace(/[^0-9]/g, ''))).catch(() => null));
    const reason = isSlashCommand
      ? interactionOrMessage.options.getString('reason') || 'No reason provided'
      : args.slice(1).join(' ') || 'No reason provided';
    // Permission checks
    if (!member?.permissions?.has(PermissionFlagsBits.KickMembers)) {
      const msg = '❌ **You do not have permission to kick users!**';
      return isSlashCommand
        ? await interactionOrMessage.reply({ content: msg, ephemeral: true })
        : await interactionOrMessage.channel.send(msg);
    }
    if (!guild?.members?.me?.permissions?.has(PermissionFlagsBits.KickMembers)) {
      const msg = '❌ **I do not have permission to kick users!**';
      return isSlashCommand
        ? await interactionOrMessage.reply({ content: msg, ephemeral: true })
        : await interactionOrMessage.channel.send(msg);
    }
    if (!targetMember) {
      const msg = '❌ **Please specify the user you want to kick!**';
      return isSlashCommand
        ? await interactionOrMessage.reply({ content: msg, ephemeral: true })
        : await interactionOrMessage.channel.send(msg);
    }
    // Additional checks for bots, admins, and self-kicking
    if (targetMember.user?.bot) {
      const msg = '❌ **You cannot kick a bot!**';
      return isSlashCommand
        ? await interactionOrMessage.reply({ content: msg, ephemeral: true })
        : await interactionOrMessage.channel.send(msg);
    }
    if (targetMember.permissions?.has(PermissionFlagsBits.Administrator)) {
      const msg = '❌ **You cannot kick an administrator!**';
      return isSlashCommand
        ? await interactionOrMessage.reply({ content: msg, ephemeral: true })
        : await interactionOrMessage.channel.send(msg);
    }
    if (targetMember.id === member.id) {
      const msg = '❌ **You cannot kick yourself!**';
      return isSlashCommand
        ? await interactionOrMessage.reply({ content: msg, ephemeral: true })
        : await interactionOrMessage.channel.send(msg);
    }
    if (!targetMember.kickable) {
      const msg = '❌ **I cannot kick this user.**';
      return isSlashCommand
        ? await interactionOrMessage.reply({ content: msg, ephemeral: true })
        : await interactionOrMessage.channel.send(msg);
    }
    // Build the embed for kick confirmation
    const embed = new EmbedBuilder()
      .setTitle('Action: Kick')
      .setDescription(`Kicked ${targetMember.user.tag} (${targetMember.id})`)
      .setColor('Red')
      .setFooter({ text: `Kicked by ${isSlashCommand ? interactionOrMessage.user.tag : interactionOrMessage.author.tag}` });
    try {
      await targetMember.kick(reason);
      return isSlashCommand
        ? await interactionOrMessage.reply({ embeds: [embed] })
        : await interactionOrMessage.channel.send({ embeds: [embed] });
    } catch (error) {
      console.error('Error kicking user:', error);
      const msg = `❌ **Failed to kick ${targetMember.user.tag}.** Please check my permissions and try again.`;
      return isSlashCommand
        ? await interactionOrMessage.reply({ content: msg, ephemeral: true })
        : await interactionOrMessage.channel.send(msg);
    }
  }
}; 