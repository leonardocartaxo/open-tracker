process.env.DB_TYPE = 'sqlite';
process.env.JWT_SECRET = 'e2e-jwt-secret';
process.env.ADMIN_EMAIL = 'admin@example.com';
process.env.ADMIN_NAME = 'Admin';
process.env.ADMIN_PASSWORD = 'admin-password';

export const e2eAdmin = {
  email: 'admin@example.com',
  name: 'Admin',
  password: 'admin-password',
};

export const e2eEnv = {
  DB_TYPE: 'sqlite',
  JWT_SECRET: 'e2e-jwt-secret',
  ADMIN_EMAIL: e2eAdmin.email,
  ADMIN_NAME: e2eAdmin.name,
  ADMIN_PASSWORD: e2eAdmin.password,
};
