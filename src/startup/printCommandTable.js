import AsciiTable from 'ascii-table';
import { logger } from '../utils/logger.js';

export default function printCommandTable(client) {
  if (client.commands && client.commands.size > 0) {
    const table = new AsciiTable('Commands');
    table.setHeading('Command', 'Load status');
    for (const [name] of client.commands) {
      table.addRow(`${name}.js`, '✅');
    }
    logger.info('\n' + table.toString());
  }
} 