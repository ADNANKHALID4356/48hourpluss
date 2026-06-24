// prisma.config.ts
import { defineConfig } from 'prisma/config';
import 'dotenv/config';

export default defineConfig({
  schema: './prisma/schema.prisma',
  datasource: {
    // Migrations require a direct connection to acquire system locks
    url: process.env.DIRECT_URL || process.env.DATABASE_URL || '',
  },
  migrations: {
    seed: 'npx tsx ./prisma/seed.ts',
  },
});