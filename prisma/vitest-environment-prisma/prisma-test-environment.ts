import 'dotenv/config';
import { execSync } from 'node:child_process';
import { randomUUID } from 'node:crypto';
import { Environment } from 'vitest';

function generateDatabaseUlr(schema: string) {
  if (!process.env.DATABASE_URL) {
    throw new Error('Please provide a DATABASE_URL environment variable');
  }

  const url = new URL(process.env.DATABASE_URL);

  url.searchParams.set('schema', schema);

  return url.toString();
}

export default <Environment>{
  name: 'prisma',
  async setup() {
    const schema = randomUUID();

    process.env.DATABASE_URL = generateDatabaseUlr(schema);

    execSync('npx prisma migrate deploy');
    execSync('ts-node prisma/seed.ts');

    return {
      async teardown() {
        console.log('teardown');
      },
    };
  },
};
