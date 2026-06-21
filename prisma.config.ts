// prisma.config.ts
import { defineConfig } from 'prisma/config';
import path from 'path';
import 'dotenv/config';

// Dynamically generate the absolute path to prisma/dev.db
const absoluteDbPath = path.resolve(process.cwd(), 'prisma', 'dev.db');

export default defineConfig({
  schema: './prisma/schema.prisma',
  datasource: {
    url: `file:${absoluteDbPath}`,
  },
  migrations: {
    seed: 'npx tsx ./prisma/seed.ts',
  },
});