import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';

export default {
  data: new SlashCommandBuilder()
    .setName('queue')
    .setDescription('Check the current queue!'),
  name: 'queue',
  category: 'music',
  aliases: ['q'],
  description: 'Check the current queue!',
  usage: 'queue',
  async execute(interactionOrMessage, client, args) {
    const isSlashCommand = interactionOrMessage.isCommand && typeof interactionOrMessage.isCommand === 'function' && interactionOrMessage.isCommand();
    const guild = interactionOrMessage.guild;
    const channel = interactionOrMessage.channel;
    const queue = client.distube.getQueue(guild);
    if (!queue) {
      const embed = new EmbedBuilder()
        .setTitle(`**Queue for ${guild.name}**`)
        .setDescription('__Now Playing:__\nNothing Playing!')
        .setColor('Red');
      return isSlashCommand
        ? await interactionOrMessage.reply({ embeds: [embed], ephemeral: true })
        : await channel.send({ embeds: [embed] });
    }
    const pages = generateQueueEmbeds(queue, guild);
    let currentPage = 0;
    const message = await (isSlashCommand
      ? interactionOrMessage.reply({ embeds: [pages[currentPage]], fetchReply: true, ephemeral: true })
      : channel.send({ embeds: [pages[currentPage]] }));
    if (pages.length > 1 && !isSlashCommand) {
      await message.react('⏪');
      await message.react('⏩');
      const filter = (reaction, user) => ['⏪', '⏩'].includes(reaction.emoji.name) && !user.bot;
      const collector = message.createReactionCollector({ filter, time: 60000 });
      collector.on('collect', (reaction, user) => {
        reaction.users.remove(user);
        if (reaction.emoji.name === '⏩') {
          currentPage = currentPage + 1 < pages.length ? ++currentPage : 0;
        } else if (reaction.emoji.name === '⏪') {
          currentPage = currentPage > 0 ? --currentPage : pages.length - 1;
        }
        message.edit({ embeds: [pages[currentPage]] });
      });
      collector.on('end', () => {
        message.reactions.removeAll().catch(() => {});
      });
    }
  }
};

// Function to generate paginated queue embeds
function generateQueueEmbeds(queue, guild) {
  const pages = [];
  const totalLength = queue.formattedDuration;
  const songsCount = queue.songs.length;
  const loopStatus = queue.repeatMode === 1 ? '🔂' : '❌';
  const queueLoopStatus = queue.repeatMode === 2 ? '🔁' : '❌';
  // Check if there's only one song, no upcoming songs
  if (songsCount === 1) {
    const embed = new EmbedBuilder()
      .setTitle(`**Queue for ${guild.name}**`)
      .setDescription(`__Now Playing:__\n[${queue.songs[0].name}](${queue.songs[0].url})\n\`${queue.songs[0].formattedDuration}\` Requested by: ${queue.songs[0].user.tag}`)
      .setColor('Red')
      .addFields(
        { name: "__Up Next:__", value: "No more songs in the queue." },
        { name: "\u200B", value: `**${songsCount} song in queue | ${totalLength} total length**` },
        { name: "Page", value: `1/1 | Loop: ${loopStatus} | Queue Loop: ${queueLoopStatus}` }
      );
    pages.push(embed);
  } else {
    let k = 10;
    for (let i = 1; i < queue.songs.length; i += 10) {
      const current = queue.songs.slice(i, k);
      let j = i - 1;
      k += 10;
      // Map the upcoming songs and truncate if necessary
      const info = current.length > 0
        ? current.map(song => `\`${++j}.\` [${song.name}](${song.url})\n \`${song.formattedDuration}\` Requested by: ${song.user.tag}`)
            .join('\n')
            .slice(0, 1024)  // Ensure it does not exceed 1024 characters
        : "No more songs in the queue.";
      const embed = new EmbedBuilder()
        .setTitle(`**Queue for ${guild.name}**`)
        .setDescription(`__Now Playing:__\n[${queue.songs[0].name}](${queue.songs[0].url})\n\`${queue.songs[0].formattedDuration}\` Requested by: ${queue.songs[0].user.tag}`)
        .setColor('Red')
        .addFields(
          { name: "__Up Next:__", value: info },
          { name: "\u200B", value: `**${songsCount} songs in queue | ${totalLength} total length**` },
          { name: "Page", value: `${Math.ceil(i / 10)}/${Math.ceil(queue.songs.length / 10)} | Loop: ${loopStatus} | Queue Loop: ${queueLoopStatus}` }
        );
      pages.push(embed);
    }
  }
  return pages;
} 