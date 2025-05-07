import { readdir } from 'fs/promises';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default {
  name: 'distubeInit',
  once: true,
  async execute(client) {
    const distube = client.distube;
    const eventsPath = path.join(__dirname, 'DistubeEvents');
    const files = await readdir(eventsPath);
    for (const file of files) {
      if (file.endsWith('.js')) {
        const eventModule = (await import(pathToFileURL(path.join(eventsPath, file)).href)).default;
        if (eventModule && eventModule.event && typeof eventModule.handler === 'function') {
          distube.on(eventModule.event, eventModule.handler);
        }
      }
    }
  },
};
