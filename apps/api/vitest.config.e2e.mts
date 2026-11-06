import { defineConfig } from 'vitest/config';
import tsconfigPaths from 'vite-tsconfig-paths';

const e2eEnv = {
  DB_TYPE: 'sqlite',
  JWT_SECRET: 'e2e-jwt-secret',
  ADMIN_EMAIL: 'admin@example.com',
  ADMIN_NAME: 'Admin',
  ADMIN_PASSWORD: 'admin-password',
};

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    globals: true,
    root: './',
    include: ['**/*.e2e-spec.ts'],
    setupFiles: ['./test/e2e-env.ts'],
    env: e2eEnv,
    fileParallelism: false,
    hookTimeout: 30_000,
    testTimeout: 30_000,
  },
});