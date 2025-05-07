// Main entry point for the Discord music bot.
import 'dotenv/config';
import { Client, Collection, GatewayIntentBits, REST, Routes } from 'discord.js';
import { loadCommands, loadEvents } from './src/utils/loader.js';
import { createDisTube } from './src/services/distubeService.js';
import distubeEvents from './src/events/distubeEvents.js';
import { readdir, stat } from 'fs/promises';
import path from 'path';
import { pathToFileURL } from 'url';
import AsciiTable from 'ascii-table';

// Initialize Discord client with required intents
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.MessageContent
  ]
});

// Command and alias collections for prefix and slash commands
client.commands = new Collection();

// Automatically register slash commands (guild if GUILD_ID is set, otherwise global)
async function autoRegisterCommands() {
  const commands = [];
  const commandsPath = path.join(process.cwd(), 'src', 'commands');
  // Recursively load all command files
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
  
  // Register for a specific guild and globally
  if (process.env.GUILD_ID) {
    console.log(`Registering ${commands.length} commands for guild ${process.env.GUILD_ID}...`);
    await rest.put(
      Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
      { body: commands }
    );
    console.log('Successfully registered application (/) commands for guild.');
  } else {
    console.log(`Registering ${commands.length} commands globally...`);
    await rest.put(
      Routes.applicationCommands(process.env.CLIENT_ID),
      { body: commands }
    );
    console.log('Successfully registered application (/) commands globally.');
  }
}

await autoRegisterCommands();

// Load all commands and event handlers
await loadCommands(client);
await loadEvents(client);

// Build and print ASCII table of loaded commands
const table = new AsciiTable('Commands');
table.setHeading('Command', 'Load status');
for (const [name, command] of client.commands) {
  table.addRow(`${name}.js`, '✅');
}
console.log(table.toString());

// Initialize DisTube and register music event handlers
client.distube = createDisTube(client);
distubeEvents.execute(client);

// Log in to Discord
client.login(process.env.DISCORD_TOKEN); 