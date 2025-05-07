/**
 * Utility for dynamically loading commands and events.
 * - Recursively loads all command files and registers them (including aliases).
 * - Loads all event handlers and attaches them to the client.
 */
import { readdir, stat } from 'fs/promises';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function loadCommands(client) {
  client.commands = client.commands || new Map();
  client.aliases = client.aliases || new Map();
  const commandsPath = path.join(__dirname, '../commands');
  await loadCommandCategory(client, commandsPath);
}

async function loadCommandCategory(client, dir) {
  const files = await readdir(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    const fileStat = await stat(filePath);
    if (fileStat.isDirectory()) {
      await loadCommandCategory(client, filePath);
    } else if (file.endsWith('.js')) {
      const command = (await import(pathToFileURL(filePath).href)).default;
      if (command && command.data && command.execute) {
        client.commands.set(command.data.name, command);
        // Register aliases for prefix commands
        if (Array.isArray(command.aliases)) {
          for (const alias of command.aliases) {
            client.aliases.set(alias, command.data.name);
          }
        }
      }
    }
  }
}

async function loadEvents(client) {
  const eventsPath = path.join(__dirname, '../events');
  const files = await readdir(eventsPath);
  for (const file of files) {
    if (file.endsWith('.js')) {
      // Dynamically import and register each event handler
      const event = (await import(pathToFileURL(path.join(eventsPath, file)).href)).default;
      if (event && event.name && event.execute) {
        if (event.once) {
          client.once(event.name, (...args) => event.execute(...args, client));
        } else {
          client.on(event.name, (...args) => event.execute(...args, client));
        }
      }
    }
  }
}

export { loadCommands, loadEvents }; 