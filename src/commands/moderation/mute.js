import { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } from 'discord.js';

export default {
  data: new SlashCommandBuilder()
    .setName('mute')
    .setDescription('Mute a specified user in the server')
    .addUserOption(option =>
      option.setName('target')
        .setDescription('The user to mute')
        .setRequired(true)
    )
    .addStringOption(option =>
      option.setName('reason')
        .setDescription('The reason for muting')
        .setRequired(false)
    )
    .addIntegerOption(option =>
      option.setName('duration')
        .setDescription('The duration of the mute in minutes')
        .setRequired(false)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),
  name: 'mute',
  category: 'moderation',
  aliases: [], // Add aliases if needed
  description: 'Mute a specified user in the server',
  usage: 'mute <@user> <reason> <duration>',
  async execute(interactionOrMessage, client, args) {
    // Detect if this is a slash command
    const isSlashCommand = interactionOrMessage.isCommand && typeof interactionOrMessage.isCommand === 'function' && interactionOrMessage.isCommand();
    const guild = interactionOrMessage.guild;
    const member = interactionOrMessage.member;
    // Get target member, reason, and duration based on command type
    const targetMember = isSlashCommand
      ? interactionOrMessage.options.getMember('target')
      : interactionOrMessage.mentions?.members?.first() || (args[0] && (await guild.members.fetch(args[0].replace(/[^0-9]/g, ''))).catch(() => null));
    const reason = isSlashCommand
      ? interactionOrMessage.options.getString('reason') || 'No reason provided'
      : args[1] || 'No reason provided';
    const duration = isSlashCommand
      ? interactionOrMessage.options.getInteger('duration') || null
      : (args[2] && !isNaN(parseInt(args[2])) ? parseInt(args[2]) : null);
    // Permission checks
    if (!member?.permissions?.has(PermissionFlagsBits.ModerateMembers)) {
      const msg = '❌ **You do not have permission to mute users!**';
      return isSlashCommand
        ? await interactionOrMessage.reply({ content: msg, ephemeral: true })
        : await interactionOrMessage.channel.send(msg);
    }
    if (!guild?.members?.me?.permissions?.has(PermissionFlagsBits.ModerateMembers)) {
      const msg = '❌ **I do not have permission to mute users!**';
      return isSlashCommand
        ? await interactionOrMessage.reply({ content: msg, ephemeral: true })
        : await interactionOrMessage.channel.send(msg);
    }
    if (!targetMember) {
      const msg = '❌ **Please specify the user you want to mute!**';
      return isSlashCommand
        ? await interactionOrMessage.reply({ content: msg, ephemeral: true })
        : await interactionOrMessage.channel.send(msg);
    }
    // Additional checks for self-muting or muting higher roles
    if (targetMember.id === member.id) {
      const msg = '❌ **You cannot mute yourself!**';
      return isSlashCommand
        ? await interactionOrMessage.reply({ content: msg, ephemeral: true })
        : await interactionOrMessage.channel.send(msg);
    }
    if (targetMember.permissions?.has(PermissionFlagsBits.Administrator)) {
      const msg = '❌ **You cannot mute an administrator!**';
      return isSlashCommand
        ? await interactionOrMessage.reply({ content: msg, ephemeral: true })
        : await interactionOrMessage.channel.send(msg);
    }
    if (!targetMember.moderatable) {
      const msg = '❌ **I cannot mute this user.**';
      return isSlashCommand
        ? await interactionOrMessage.reply({ content: msg, ephemeral: true })
        : await interactionOrMessage.channel.send(msg);
    }
    // Build the embed for mute confirmation
    const embed = new EmbedBuilder()
      .setTitle('Action: Mute')
      .setDescription(`Muted ${targetMember.user.tag} (${targetMember.id})`)
      .setColor('Orange')
      .setFooter({ text: `Muted by ${isSlashCommand ? interactionOrMessage.user.tag : interactionOrMessage.author.tag}` });
    try {
      // Apply the mute (timeout)
      if (duration) {
        await targetMember.timeout(duration * 60 * 1000, reason); // Mutes for specified minutes
      } else {
        await targetMember.timeout(28 * 24 * 60 * 60 * 1000, reason); // Discord max timeout (28 days)
      }
      return isSlashCommand
        ? await interactionOrMessage.reply({ embeds: [embed] })
        : await interactionOrMessage.channel.send({ embeds: [embed] });
    } catch (error) {
      console.error('Error muting user:', error);
      const msg = `❌ **Failed to mute ${targetMember.user.tag}.** Please check my permissions and try again.`;
      return isSlashCommand
        ? await interactionOrMessage.reply({ content: msg, ephemeral: true })
        : await interactionOrMessage.channel.send(msg);
    }
  }
}; 