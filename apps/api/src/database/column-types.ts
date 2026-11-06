/**
 * Column types shared by Postgres and the in-memory SQLite database used in e2e tests.
 * `DB_TYPE=sqlite` must be set before entity modules are imported; decorators read these values once.
 */
export const dateColumnType = process.env.DB_TYPE === 'sqlite' ? ('datetime' as const) : ('timestamptz' as const);

export const enumColumnType = process.env.DB_TYPE === 'sqlite' ? ('simple-enum' as const) : ('enum' as const);
