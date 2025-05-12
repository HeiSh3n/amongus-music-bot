# Among Us! Discord Music Bot

![Node.js](https://img.shields.io/badge/Node.js-18%2B-green)
![Discord.js](https://img.shields.io/badge/discord.js-v14-blue)
![Database](https://img.shields.io/badge/Database-MariaDB%2C%20MySQL%2C%20PostgreSQL%2C%20MongoDB%2C%20SQLite-blue)

A modern, modular Discord music bot built with Node.js, DisTube.js, and discord.js best practices. Supports both slash and prefix commands, dynamic event and command loading, robust error handling, per-guild configuration, and dynamic multi-database support via a unified adapter system.

## Features
- 🎵 Music playback from YouTube, Spotify, SoundCloud, and more
- Slash and prefix command support
- Dynamic command/event loading
- Per-guild prefix and emoji status (database-agnostic)
- Rich embeds, paginated queue, progress bar, and more
- **Fully modular, event-driven, and maintainable codebase**
- **Dynamic multi-database support**: MariaDB, MySQL, PostgreSQL, MongoDB, SQLite
- **discord.js best practices**

## Setup

### 1. Clone the repository
```sh
git clone https://github.com/HeiSh3n/amongus-music-bot.git
cd amongus-music-bot
```

### 2. Install dependencies
```sh
npm install
```

### 3. Create a `.env` file
Create a `.env` file in the project root with the following variables:
```env
DISCORD_TOKEN=your_discord_bot_token
CLIENT_ID=your_discord_client_id
DB_TYPE=mariadb # (default mariadb, see Database Support below)
DB_HOST=localhost
DB_PORT=3306
DB_USER=your_db_user
DB_PASS=your_db_password
DB_NAME=your_db_name
GUILD_ID=your_guild_id # (optional, for testing slash commands)
```

### 4. Create a `cookies.json` file
- Place it in the project root or in `src/config/cookies.json`.


#### How to get YouTube cookies
1. Install the [EditThisCookie](https://chrome.google.com/webstore/detail/editthiscookie/fngmhnnpilhplaeedifhccceomclgfbg) extension for your browser.
2. Go to [YouTube](https://www.youtube.com/).
3. Log in to your account. (**Tip:** Use a new/throwaway account for security.)
4. Click on the EditThisCookie extension icon and click the "Export" icon.
5. Your cookies will be copied to your clipboard. Paste them into your `cookies.json` file as described above.

**⚠️ Warnings about YouTube cookies:**
- **Do not log out** using the logout button on YouTube/Google account manager, as it will expire your cookies. To log out, delete your browser's cookies or use incognito mode to get your cookies and then close the window.
- **Paste all cookies** from the clipboard into your `cookies.json` file. Do not remove or edit any cookies unless you know what you're doing.
- **Use the same IP**: Make sure the account you used to get your cookies is only used from one IP at a time. This will help keep your cookies valid longer.

### 5. Start the bot
```sh
npm start
```

## Usage
- Use `/play <song>` or your custom prefix (default: `.play <song>`) to play music.
- Use `/help` or `.help` for a list of commands.
- All moderation and music commands support both slash and prefix styles.

## Architecture & Modularity

This bot follows **discord.js best practices** for modularity and maintainability:
- All startup logic (slash command registration, DisTube setup, emoji setup, etc.) is separated into individual files under `src/startup/`.
- The main `ready.js` event handler simply imports and calls these startup functions in order.
- Adding new startup routines is as simple as creating a new file in `src/startup/` and importing it in `ready.js`.
- All database operations are routed through a single `src/database/adapter.js` for a backend-agnostic interface.
- Each database backend (MariaDB, MySQL, PostgreSQL, MongoDB, SQLite) has its own folder in `src/database/` with a shared `pool.js`/`client.js` and modular logic for `prefix` and `emoji` operations.

## Database Support

Among Us! supports multiple major databases out of the box. To switch databases, set the `DB_TYPE` variable in your `.env` file to one of:
- `mariadb`
- `mysql`
- `postgres`
- `mongo`
- `sqlite`

No code changes are required—just update your `.env` and ensure the backend is running.

**How it works:**
- The bot uses a dynamic adapter system (`src/database/adapter.js`) to load the correct backend at runtime.
- Each backend implements a unified interface for prefix and emoji operations.
- Connection logic and schema creation are handled per-backend in their respective folders.

**Adding a new backend:**
1. Create a new folder in `src/database/` (e.g., `oracle/`).
2. Implement `prefix.js`, `emoji.js`, and a shared `pool.js` or `client.js` as needed.
3. Update the switch in `adapter.js` to support your new backend.

## Contributing
- Follow the project coding standards.
- Do not commit `.env`, `cookies.json`, or any sensitive files.
- Open issues or pull requests for improvements.

## License
MIT
