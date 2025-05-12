# Changelog

## [v1.0.0] - 2025-05-07

### Summary
Initial release of Among Us! Discord Music Bot, a modern, modular music bot built with Node.js, DisTube.js, and discord.js best practices.

### Added
- Music playback from YouTube, Spotify, SoundCloud, and more via DisTube.js.
- Slash and prefix command support.
- Dynamic command and event loading.
- Per-guild prefix and emoji configuration.
- Rich embeds, paginated queue, progress bar, and more.
- Modular, maintainable codebase following discord.js best practices.

### Description
This version introduces the core features of the Among Us music bot, providing a robust, extensible foundation for Discord music playback. The architecture is fully modular and event-driven, making it easy to extend and maintain in line with discord.js standards.

## [v1.1.0] - 2025-05-12

### Summary
This update brings key improvements to stability, performance, and maintainability across the bot's core systems, with a focus on resource management, event handling, and bug fixes.

### Added
- Introduced a shared `mariadbPool.js` to manage the MariaDB connection pool.
- Updated MariaDB adapters to use the shared pool for all database operations.
- Refactored DisTube event loader to safely remove old listeners before re-adding.
- Improved structure and consistency in event and command files.
- Ensured `.env` variables are loaded consistently across all modules.

### Fixed
- Prevented multiple MariaDB pools from being created, improving resource handling and stability.
- Fixed `/play` slash command to correctly retrieve the song name from the command option, ensuring reliable playback.
- Eliminated `MaxListenersExceededWarning` and potential memory leaks by cleaning up DisTube event listeners.

### Description
This release focuses on discord.js best practices for resource management and event-driven architecture. The MariaDB pool refactor ensures efficient database connections, while the DisTube event handler improvements prevent memory leaks. General code cleanup and bug fixes further enhance maintainability and reliability.

## [v1.2.0] - 2025-05-12

### Summary
This release introduces a major refactor of the bot's startup logic for improved modularity, maintainability discord.js best practices. 
All startup routines are now separated into individual files under `src/startup/`, and the `ready.js` event handler is clean and focused.

### Added
- Each startup function (command table, activity, emoji setup, slash command registration, DisTube setup, etc.) is now in its own file in `src/startup/`.
- `ready.js` now simply imports and calls these startup functions in order.
- Improved logging and startup diagnostics.

### Changed
- Removed all in-file startup logic from `ready.js`.
- All startup logic is now modular and easy to maintain or extend.

### Description
This refactor makes the codebase much easier to maintain and extend. Startup logic is now cleanly separated, and the main event handler is minimal. This structure is recommended by the discord.js will make future development and debugging much easier.

## [v1.3.0] - 2025-05-12

### Summary
This release introduces dynamic, modular support for multiple major databases: MariaDB, MySQL, PostgreSQL, MongoDB, and SQLite. The new adapter system provides a unified interface for all database operations, with each backend in its own folder for maintainability and extensibility.

### Added
- Dynamic database backend support via `DB_TYPE` environment variable.
- Modular adapters for MariaDB, MySQL, PostgreSQL, MongoDB, and SQLite in `src/database/`.
- Each backend has its own `pool.js`/`client.js`, `prefix.js`, and `emoji.js` for clean separation.
- All database operations are now routed through a single `adapter.js` for a backend-agnostic interface.

### Changed
- Removed legacy service files and monolithic adapters.
- All imports now use `src/database/adapter.js` for database operations.
- Table/collection creation logic is handled in each backend adapter.

### Description
This refactor makes it easy to add or switch database backends with minimal code changes. The codebase is now fully modular, maintainable. Just set `DB_TYPE` in your `.env` to use your preferred backend.

## [v1.3.1] - 2025-05-12

### Summary
This update improves configuration management by providing a sensible default for the database backend and centralizing environment variable handling.

### Changed
- The database type (`DB_TYPE`) is now managed through the config layer (`src/config/config.js`), with a default of `'mariadb'` if not specified in the environment.
- `src/database/adapter.js` now imports the database type from the config module instead of reading directly from `process.env`.

### Description
This change ensures MariaDB is used by default if no database type is specified, making setup easier for new users. Centralizing configuration in the config layer improves maintainability and aligns with discord.js best practices.

---

See previous releases for earlier changes. 