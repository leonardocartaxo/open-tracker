declare module 'better-sqlite3' {
  class Database {
    constructor(
      filename: string,
      options?: {
        readonly?: boolean;
        fileMustExist?: boolean;
        timeout?: number;
        verbose?: ((message?: unknown) => void) | null;
        nativeBinding?: string | null;
      },
    );

    close(): void;

    pragma(source: string, options?: { simple?: boolean }): unknown;
  }

  export default Database;
}
