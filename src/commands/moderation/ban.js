import { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } from 'discord.js';

export default {
  data: new SlashCommandBuilder()
    .setName('ban')
    .setDescription('Ban a specified user from the server')
    .addUserOption(option =>
      option.setName('target')
        .setDescription('The user to ban')
        .setRequired(true)
    )
    .addStringOption(option =>
      option.setName('reason')
        .setDescription('The reason for banning')
        .setRequired(false)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),
  name: 'ban',
  category: 'moderation',
  aliases: [], // Add aliases if needed
  description: 'Ban a specified user from the server',
  usage: 'ban <@user> <reason>',
  async execute(interactionOrMessage, client, args) {
    // Detect if this is a slash command
    const isSlashCommand = interactionOrMessage.isCommand && typeof interactionOrMessage.isCommand === 'function' && interactionOrMessage.isCommand();
    const guild = interactionOrMessage.guild;
    const member = interactionOrMessage.member;
    // Get target user and reason based on command type
    const targetUser = isSlashCommand
      ? interactionOrMessage.options.getUser('target')
      : interactionOrMessage.mentions?.members?.first() || (args[0] && (await guild.members.fetch(args[0].replace(/[^0-9]/g, ''))).catch(() => null));
    const reason = isSlashCommand
      ? interactionOrMessage.options.getString('reason') || 'No reason provided'
      : args.slice(1).join(' ') || 'No reason provided';
    // Permission checks
    if (!member?.permissions?.has(PermissionFlagsBits.BanMembers)) {
      const msg = '❌ **You do not have permission to ban users!**';
      return isSlashCommand
        ? await interactionOrMessage.reply({ content: msg, ephemeral: true })
        : await interactionOrMessage.channel.send(msg);
    }
    if (!guild?.members?.me?.permissions?.has(PermissionFlagsBits.BanMembers)) {
      const msg = '❌ **I do not have permission to ban users!**';
      return isSlashCommand
        ? await interactionOrMessage.reply({ content: msg, ephemeral: true })
        : await interactionOrMessage.channel.send(msg);
    }
    if (!targetUser) {
      const msg = '❌ **Please specify the user you want to ban!**';
      return isSlashCommand
        ? await interactionOrMessage.reply({ content: msg, ephemeral: true })
        : await interactionOrMessage.channel.send(msg);
    }
    if (targetUser.id === member.id) {
      const msg = '❌ **You cannot ban yourself!**';
      return isSlashCommand
        ? await interactionOrMessage.reply({ content: msg, ephemeral: true })
        : await interactionOrMessage.channel.send(msg);
    }
    // Fetch the member object for the target user
    let targetMember;
    try {
      targetMember = guild.members.cache.get(targetUser.id) || await guild.members.fetch(targetUser.id);
    } catch {
      targetMember = null;
    }
    if (!targetMember || !targetMember.bannable) {
      const msg = `❌ **I cannot ban this user.**`;
      return isSlashCommand
        ? await interactionOrMessage.reply({ content: msg, ephemeral: true })
        : await interactionOrMessage.channel.send(msg);
    }
    // Build the embed for ban confirmation
    const embed = new EmbedBuilder()
      .setTitle('Action: Ban')
      .setDescription(`Banned ${targetUser.tag} (${targetUser.id})`)
      .setColor('Red')
      .setThumbnail(targetUser.displayAvatarURL())
      .setFooter({ text: `Banned by ${isSlashCommand ? interactionOrMessage.user.tag : interactionOrMessage.author.tag}` });
    try {
      await targetMember.ban({ reason });
      return isSlashCommand
        ? await interactionOrMessage.reply({ embeds: [embed] })
        : await interactionOrMessage.channel.send({ embeds: [embed] });
    } catch (error) {
      console.error('Error banning user:', error);
      const msg = `❌ **Failed to ban ${targetUser.tag}.** Please check my permissions and try again.`;
      return isSlashCommand
        ? await interactionOrMessage.reply({ content: msg, ephemeral: true })
        : await interactionOrMessage.channel.send(msg);
    }
  }
}; 