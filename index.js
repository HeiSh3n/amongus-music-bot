import 'dotenv/config';
import { Client, GatewayIntentBits } from 'discord.js';
import { loadCommands, loadEvents } from './src/utils/loader.js';

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.MessageContent
  ]
});

await loadCommands(client);
await loadEvents(client);

client.login(process.env.DISCORD_TOKEN); 
