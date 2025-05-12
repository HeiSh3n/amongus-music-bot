# Changelog

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
This refactor makes it easy to add or switch database backends with minimal code changes. The codebase is now fully modular, maintainable, and context7-compliant. Just set `DB_TYPE` in your `.env` to use your preferred backend.

---

See previous releases for earlier changes. 