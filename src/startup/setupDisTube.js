import { createDisTube } from '../DistubeEvents/distubeService.js';
import distubeEvents from '../DistubeEvents/distubeEvents.js';
 
export default async function setupDisTube(client) {
  client.distube = createDisTube(client);
  await distubeEvents.execute(client);
} 