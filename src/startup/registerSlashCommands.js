import path from 'path';
import { readdir, stat } from 'fs/promises';
import { pathToFileURL } from 'url';
import { REST, Routes } from 'discord.js';
import { logger } from '../utils/logger.js';

export default async function registerSlashCommands(client) {
  const commands = [];
  const commandsPath = path.join(process.cwd(), 'src', 'commands');
  async function loadCommandsForRegister(dir) {
    const files = await readdir(dir);
    for (const file of files) {
      const filePath = path.join(dir, file);
      const fileStat = await stat(filePath);
      if (fileStat.isDirectory()) {
        await loadCommandsForRegister(filePath);
      } else if (file.endsWith('.js')) {
        const commandModule = (await import(pathToFileURL(filePath).href)).default;
        if (commandModule && commandModule.data) {
          commands.push(commandModule.data.toJSON());
        }
      }
    }
  }
  await loadCommandsForRegister(commandsPath);
  const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

  const guildId = process.env.GUILD_ID;
  const clientId = process.env.CLIENT_ID;

  if (guildId) {
    // Check if the bot is in the guild
    const guild = client.guilds.cache.get(guildId);
    if (!guild) {
      logger.warn(
        `GUILD_ID ${guildId} is set, but the bot is not a member of that guild. Skipping guild command registration.`
      );
      return;
    }
    logger.info(`Registering ${commands.length} commands for guild ${guildId}...`);
    await rest.put(
      Routes.applicationGuildCommands(clientId, guildId),
      { body: commands }
    );
    logger.info('Successfully registered application (/) commands for guild.');
  } else {
    logger.info(`Registering ${commands.length} commands globally...`);
    await rest.put(
      Routes.applicationCommands(clientId),
      { body: commands }
    );
    logger.info('Successfully registered application (/) commands globally.');
  }
} 