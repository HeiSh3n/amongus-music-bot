# Among Us! Discord Music Bot

![Node.js](https://img.shields.io/badge/Node.js-18%2B-green)
![Discord.js](https://img.shields.io/badge/discord.js-v14-blue)
![MariaDB](https://img.shields.io/badge/MariaDB-supported-blue)

A modern Discord music bot built with Node.js, DisTube.js, and MariaDB. Supports both slash and prefix commands, dynamic loading, robust error handling, and per-guild configuration.

## Features
- 🎵 Music playback from YouTube, Spotify, SoundCloud, and more
- Slash and prefix command support
- Dynamic command/event loading
- Per-guild prefix and emoji status (MariaDB)
- Rich embeds, paginated queue, progress bar, and more
- Modular and maintainable codebase

## Setup

### 1. Clone the repository
```sh
git clone https://github.com/B1ackGX/amongus-music-bot.git
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
DB_TYPE=mariadb # (default, see Database Support below)
DB_HOST=localhost
DB_PORT=3306
DB_USER=your_db_user
DB_PASS=your_db_password
DB_NAME=your_db_name
GUILD_ID=your_guild_id # (optional, for testing slash commands)
```

### 4. Create a `cookies.json` file
- Place it in the project root or in `src/config/cookies.json`.

- **Do NOT commit this file.**

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

## Contributing
- Follow the project coding standards.
- Do not commit `.env`, `cookies.json`, or any sensitive files.
- Open issues or pull requests for improvements.

## License
MIT

## Database Support

By default, Among Us! uses MariaDB. To use another database, implement the required interface in `src/services/prefixDatabase.*.js` and `src/services/emojiDatabase.*.js`, and update your `.env` with the correct `DB_TYPE`.

- MariaDB: Supported out of the box
- PostgreSQL: [contributions welcome]
- MongoDB: [contributions welcome] 
